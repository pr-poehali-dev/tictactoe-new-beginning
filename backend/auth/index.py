"""
Аутентификация: регистрация, вход, выход, проверка сессии.
POST / {action: "register"} — создать аккаунт
POST / {action: "login"}    — войти
POST / {action: "logout"}   — выйти
POST / {action: "me"}       — получить текущего пользователя по токену
"""
import json
import os
import hashlib
import secrets
from datetime import datetime
import psycopg2


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_token(headers: dict) -> str | None:
    auth = headers.get("x-authorization") or headers.get("authorization") or ""
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "me")

    # --- REGISTER ---
    if action == "register":
        login = (body.get("login") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not login or not email or not password:
            return _err(400, "Заполните все поля")
        if len(login) < 3:
            return _err(400, "Логин минимум 3 символа")
        if len(password) < 6:
            return _err(400, "Пароль минимум 6 символов")

        pw_hash = hash_password(password)
        token = secrets.token_hex(32)
        conn = get_conn()
        cur = conn.cursor()
        # Проверяем дубликат заранее
        cur.execute("SELECT id FROM users WHERE email = %s OR login = %s", (email, login))
        if cur.fetchone():
            cur.close()
            conn.close()
            return _err(409, "Логин или email уже заняты")

        cur.execute(
            """INSERT INTO users (login, email, password_hash)
               VALUES (%s, %s, %s)
               RETURNING id, login, email, coins, elo, level, xp, rank,
                         avatar_emoji, is_pro, wins, losses, draws,
                         glory_points, madness_tickets, pve_energy, created_at""",
            (login, email, pw_hash)
        )
        user = cur.fetchone()
        user_id = user[0]
        cur.execute(
            "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
            (user_id, "bonus", 50, "Стартовый бонус при регистрации")
        )
        cur.execute(
            "INSERT INTO sessions (user_id, token) VALUES (%s, %s)",
            (user_id, token)
        )
        conn.commit()
        cur.close()
        conn.close()

        return _ok({"token": token, "user": _row_to_user(user)})

    # --- LOGIN ---
    if action == "login":
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not email or not password:
            return _err(400, "Заполните все поля")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                """SELECT id, login, email, coins, elo, level, xp, rank,
                          avatar_emoji, is_pro, wins, losses, draws,
                          glory_points, madness_tickets, pve_energy, created_at
                   FROM users WHERE email = %s AND password_hash = %s""",
                (email, pw_hash)
            )
            user = cur.fetchone()
            if not user:
                return _err(401, "Неверный email или пароль")

            user_id = user[0]
            token = secrets.token_hex(32)
            cur.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (user_id,))
            cur.execute(
                "INSERT INTO sessions (user_id, token) VALUES (%s, %s)",
                (user_id, token)
            )

            # Ежедневный бонус
            cur.execute("SELECT last_daily_bonus FROM users WHERE id = %s", (user_id,))
            last_bonus = cur.fetchone()[0]
            daily_bonus = 0
            if last_bonus is None or (datetime.now() - last_bonus).total_seconds() >= 86400:
                cur.execute(
                    "UPDATE users SET coins = coins + 10, last_daily_bonus = NOW() WHERE id = %s",
                    (user_id,)
                )
                cur.execute(
                    "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                    (user_id, "daily_bonus", 10, "Ежедневный бонус за вход")
                )
                daily_bonus = 10
                cur.execute("SELECT coins FROM users WHERE id = %s", (user_id,))
                new_coins = cur.fetchone()[0]
                user = user[:3] + (new_coins,) + user[4:]

            conn.commit()
        finally:
            cur.close()
            conn.close()

        result = {"token": token, "user": _row_to_user(user)}
        if daily_bonus:
            result["daily_bonus"] = daily_bonus
        return _ok(result)

    # --- LOGOUT ---
    if action == "logout":
        token = get_token(headers)
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            cur.close()
            conn.close()
        return _ok({"ok": True})

    # --- ME (default) ---
    token = get_token(headers)
    if not token:
        return _err(401, "Не авторизован")

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """SELECT u.id, u.login, u.email, u.coins, u.elo, u.level, u.xp, u.rank,
                  u.avatar_emoji, u.is_pro, u.wins, u.losses, u.draws,
                  u.glory_points, u.madness_tickets, u.pve_energy, u.created_at
           FROM users u
           JOIN sessions s ON s.user_id = u.id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        return _err(401, "Сессия истекла")

    return _ok({"user": _row_to_user(user)})


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}


def _err(code: int, message: str) -> dict:
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": message}, ensure_ascii=False)}


def _row_to_user(row) -> dict:
    return {
        "id": row[0],
        "login": row[1],
        "email": row[2],
        "coins": row[3],
        "elo": row[4],
        "level": row[5],
        "xp": row[6],
        "rank": row[7],
        "avatar_emoji": row[8],
        "is_pro": row[9],
        "wins": row[10],
        "losses": row[11],
        "draws": row[12],
        "glory_points": row[13],
        "madness_tickets": row[14],
        "pve_energy": row[15],
        "created_at": row[16].isoformat() if row[16] else None,
    }