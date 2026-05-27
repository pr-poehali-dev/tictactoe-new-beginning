"""
Платежи через ЮKassa.
POST / {action: "create", package_id, token} — создать платёж, вернуть ссылку на оплату
POST / {action: "status", payment_id}        — проверить статус платежа
POST / {action: "webhook"}                   — вебхук от ЮKassa (зачислить монеты)
"""
import json
import os
import uuid
import hmac
import hashlib
import base64
import urllib.request
import urllib.parse
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}

# Пакеты монет: id → (монеты, цена в рублях, описание)
PACKAGES = {
    "coins_100":  {"coins": 100,  "rub": 99,   "label": "100 монет",  "bonus": ""},
    "coins_500":  {"coins": 500,  "rub": 399,  "label": "500 монет",  "bonus": "+50 бонус"},
    "coins_1500": {"coins": 1500, "rub": 999,  "label": "1500 монет", "bonus": "+300 бонус"},
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def yukassa_request(method: str, path: str, body: dict | None = None) -> dict:
    shop_id = os.environ["YUKASSA_SHOP_ID"]
    secret  = os.environ["YUKASSA_SECRET_KEY"]
    url = f"https://api.yookassa.ru/v3{path}"
    creds = base64.b64encode(f"{shop_id}:{secret}".encode()).decode()
    headers = {
        "Authorization": f"Basic {creds}",
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def get_user_by_token(token: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """SELECT u.id, u.coins FROM users u
           JOIN sessions s ON s.user_id = u.id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    return row


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers_raw = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    # --- CREATE PAYMENT ---
    if action == "create":
        # Авторизация
        auth = headers_raw.get("x-authorization") or headers_raw.get("authorization") or ""
        token = auth[7:] if auth.startswith("Bearer ") else None
        if not token:
            return _err(401, "Не авторизован")

        user = get_user_by_token(token)
        if not user:
            return _err(401, "Сессия истекла")
        user_id = user[0]

        package_id = body.get("package_id", "")
        pkg = PACKAGES.get(package_id)
        if not pkg:
            return _err(400, "Неверный пакет")

        # Реальные монеты с учётом бонуса
        total_coins = pkg["coins"]
        if package_id == "coins_500":
            total_coins = 550
        elif package_id == "coins_1500":
            total_coins = 1800

        idempotency_key = str(uuid.uuid4())
        return_url = body.get("return_url", "https://poehali.dev")

        # Создаём запись в БД
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO payments (user_id, package_id, coins, amount_rub, status)
               VALUES (%s, %s, %s, %s, 'pending') RETURNING id""",
            (user_id, package_id, total_coins, pkg["rub"])
        )
        payment_row_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        # Создаём платёж в ЮKassa
        yk_body = {
            "amount": {"value": f"{pkg['rub']:.2f}", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": f"Покупка {pkg['label']} — XO Arena (order #{payment_row_id})",
            "metadata": {
                "payment_row_id": str(payment_row_id),
                "user_id": str(user_id),
                "package_id": package_id,
                "coins": str(total_coins),
            },
        }

        yk_resp = yukassa_request("POST", "/payments", yk_body)

        # Сохраняем yukassa_payment_id
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE payments SET yukassa_payment_id = %s WHERE id = %s",
            (yk_resp["id"], payment_row_id)
        )
        conn.commit()
        cur.close()
        conn.close()

        confirmation_url = yk_resp["confirmation"]["confirmation_url"]
        return _ok({
            "payment_id": payment_row_id,
            "yukassa_id": yk_resp["id"],
            "confirmation_url": confirmation_url,
            "package": pkg,
            "coins": total_coins,
        })

    # --- CHECK STATUS ---
    if action == "status":
        payment_id = body.get("payment_id")
        if not payment_id:
            return _err(400, "Нет payment_id")

        auth = headers_raw.get("x-authorization") or headers_raw.get("authorization") or ""
        token = auth[7:] if auth.startswith("Bearer ") else None
        if not token:
            return _err(401, "Не авторизован")
        user = get_user_by_token(token)
        if not user:
            return _err(401, "Сессия истекла")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT status, coins, yukassa_payment_id FROM payments WHERE id = %s AND user_id = %s",
            (payment_id, user[0])
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return _err(404, "Платёж не найден")

        status, coins, yk_id = row

        # Если ещё pending — проверяем у ЮKassa
        if status == "pending" and yk_id:
            yk = yukassa_request("GET", f"/payments/{yk_id}")
            if yk.get("status") == "succeeded":
                conn = get_conn()
                cur = conn.cursor()
                cur.execute(
                    "UPDATE payments SET status = 'paid', paid_at = NOW() WHERE id = %s AND status = 'pending'",
                    (payment_id,)
                )
                cur.execute(
                    "UPDATE users SET coins = coins + %s WHERE id = %s",
                    (coins, user[0])
                )
                cur.execute(
                    "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                    (user[0], "purchase", coins, f"Покупка монет (платёж #{payment_id})")
                )
                conn.commit()
                cur.close()
                conn.close()
                status = "paid"

        # Получаем свежий баланс
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT coins FROM users WHERE id = %s", (user[0],))
        new_coins = cur.fetchone()[0]
        cur.close()
        conn.close()

        return _ok({"status": status, "coins": coins, "user_coins": new_coins})

    # --- WEBHOOK (от ЮKassa) ---
    if action == "webhook" or event.get("httpMethod") == "POST":
        # ЮKassa шлёт уведомления на этот эндпоинт
        notification = body
        if notification.get("event") != "payment.succeeded":
            return _ok({"ok": True})

        yk_payment = notification.get("object", {})
        yk_id = yk_payment.get("id")
        meta = yk_payment.get("metadata", {})
        payment_row_id = meta.get("payment_row_id")
        user_id = meta.get("user_id")
        coins = meta.get("coins")

        if not all([yk_id, payment_row_id, user_id, coins]):
            return _ok({"ok": True})

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE payments SET status = 'paid', paid_at = NOW() WHERE id = %s AND status = 'pending' AND yukassa_payment_id = %s",
            (payment_row_id, yk_id)
        )
        if cur.rowcount > 0:
            cur.execute(
                "UPDATE users SET coins = coins + %s WHERE id = %s",
                (int(coins), int(user_id))
            )
            cur.execute(
                "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                (int(user_id), "purchase", int(coins), f"Покупка монет (платёж #{payment_row_id})")
            )
        conn.commit()
        cur.close()
        conn.close()
        return _ok({"ok": True})

    return _err(400, "Неизвестное действие")


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}


def _err(code: int, message: str) -> dict:
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": message}, ensure_ascii=False)}
