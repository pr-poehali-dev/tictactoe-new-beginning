"""
Игровая логика: сохранение результатов и рейтинг.
POST / {action: "finish"}      — сохранить итог матча, обновить stats/Elo
POST / {action: "leaderboard"} — топ-100 игроков
POST / {action: "history"}     — история матчей пользователя
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}

# Изменение Elo для разных режимов
ELO_GAIN  = {"pvp": 20, "friend": 0, "ai-easy": 0, "ai-medium": 0, "ai-expert": 0}
ELO_LOSS  = {"pvp": -15, "friend": 0, "ai-easy": 0, "ai-medium": 0, "ai-expert": 0}
ELO_DRAW  = {"pvp": 3,  "friend": 0, "ai-easy": 0, "ai-medium": 0, "ai-expert": 0}
COINS_WIN = {"pvp": 15, "friend": 5, "ai-easy": 3, "ai-medium": 5, "ai-expert": 8}
COINS_DRAW = {"pvp": 5, "friend": 2, "ai-easy": 1, "ai-medium": 2, "ai-expert": 3}

MODE_LABEL = {
    "pvp": "Онлайн",
    "friend": "С другом",
    "ai-easy": "ИИ (Новичок)",
    "ai-medium": "ИИ (Любитель)",
    "ai-expert": "ИИ (Эксперт)",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user_by_token(token: str, cur):
    cur.execute(
        """SELECT u.id, u.coins, u.elo, u.wins, u.losses, u.draws, u.is_pro
           FROM users u
           JOIN sessions s ON s.user_id = u.id
           WHERE s.token = %s AND s.expires_at > NOW()""",
        (token,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers_raw = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    # --- FINISH MATCH ---
    if action == "finish":
        auth = headers_raw.get("x-authorization") or headers_raw.get("authorization") or ""
        token = auth[7:] if auth.startswith("Bearer ") else None
        if not token:
            return _err(401, "Не авторизован")

        mode = body.get("mode", "ai-easy")
        result = body.get("result", "")  # "won" | "lost" | "draw"
        opponent = body.get("opponent", "Bot")
        duration_sec = body.get("duration_sec", 0)

        if result not in ("won", "lost", "draw"):
            return _err(400, "Неверный результат")

        conn = get_conn()
        cur = conn.cursor()

        user = get_user_by_token(token, cur)
        if not user:
            cur.close(); conn.close()
            return _err(401, "Сессия истекла")

        user_id, coins, elo, wins, losses, draws, is_pro = user

        # Считаем изменения
        if result == "won":
            elo_delta   = ELO_GAIN.get(mode, 0)
            coins_earned = COINS_WIN.get(mode, 0)
            if is_pro:
                coins_earned *= 2
        elif result == "draw":
            elo_delta   = ELO_DRAW.get(mode, 0)
            coins_earned = COINS_DRAW.get(mode, 0)
            if is_pro:
                coins_earned *= 2
        else:
            elo_delta   = ELO_LOSS.get(mode, 0)
            coins_earned = 0

        new_elo   = max(0, elo + elo_delta)
        new_coins = coins + coins_earned

        # XP за игру
        xp_earned = 10 if result == "won" else 5 if result == "draw" else 3

        # Обновляем пользователя
        if result == "won":
            cur.execute(
                """UPDATE users SET wins = wins + 1, coins = %s, elo = %s,
                   xp = xp + %s WHERE id = %s""",
                (new_coins, new_elo, xp_earned, user_id)
            )
        elif result == "lost":
            cur.execute(
                """UPDATE users SET losses = losses + 1, coins = %s, elo = %s,
                   xp = xp + %s WHERE id = %s""",
                (new_coins, new_elo, xp_earned, user_id)
            )
        else:
            cur.execute(
                """UPDATE users SET draws = draws + 1, coins = %s, elo = %s,
                   xp = xp + %s WHERE id = %s""",
                (new_coins, new_elo, xp_earned, user_id)
            )

        # Уровень: каждые 100 XP = +1 уровень
        cur.execute("SELECT xp, level FROM users WHERE id = %s", (user_id,))
        xp_row = cur.fetchone()
        new_xp, cur_level = xp_row
        new_level = max(1, new_xp // 100 + 1)
        if new_level != cur_level:
            cur.execute("UPDATE users SET level = %s WHERE id = %s", (new_level, user_id))

        # Ранг по Elo
        rank = _calc_rank(new_elo)
        cur.execute("UPDATE users SET rank = %s WHERE id = %s", (rank, user_id))

        # История матча
        cur.execute(
            """INSERT INTO match_history
               (user_id, mode, result, opponent, elo_before, elo_after, elo_delta, coins_earned, duration_sec)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (user_id, mode, result, opponent, elo, new_elo, elo_delta, coins_earned, duration_sec)
        )

        # Транзакция монет
        if coins_earned > 0:
            cur.execute(
                "INSERT INTO transactions (user_id, type, amount, description) VALUES (%s, %s, %s, %s)",
                (user_id, "game_reward", coins_earned, f"Награда за матч ({MODE_LABEL.get(mode, mode)})")
            )

        conn.commit()
        cur.close()
        conn.close()

        return _ok({
            "elo_delta": elo_delta,
            "new_elo": new_elo,
            "coins_earned": coins_earned,
            "new_coins": new_coins,
            "xp_earned": xp_earned,
            "new_level": new_level,
            "rank": rank,
        })

    # --- LEADERBOARD ---
    if action == "leaderboard":
        period = body.get("period", "all")  # "all" | "season" | "week"
        limit = min(int(body.get("limit", 50)), 100)

        conn = get_conn()
        cur = conn.cursor()

        if period == "week":
            cur.execute(
                """SELECT u.id, u.login, u.avatar_emoji, u.elo, u.rank, u.is_pro,
                          COUNT(m.id) FILTER (WHERE m.result = 'won') AS wins,
                          COUNT(m.id) AS total_games
                   FROM users u
                   LEFT JOIN match_history m ON m.user_id = u.id
                     AND m.created_at >= NOW() - INTERVAL '7 days'
                   GROUP BY u.id
                   ORDER BY wins DESC, u.elo DESC
                   LIMIT %s""",
                (limit,)
            )
        else:
            cur.execute(
                """SELECT id, login, avatar_emoji, elo, rank, is_pro, wins,
                          (wins + losses + draws) AS total_games
                   FROM users
                   ORDER BY elo DESC, wins DESC
                   LIMIT %s""",
                (limit,)
            )

        rows = cur.fetchall()
        cur.close()
        conn.close()

        players = []
        for i, row in enumerate(rows):
            total = row[7] or 0
            win_rate = round((row[6] / total) * 100) if total > 0 else 0
            players.append({
                "position": i + 1,
                "id": row[0],
                "login": row[1],
                "avatar_emoji": row[2],
                "elo": row[3],
                "rank": row[4],
                "is_pro": row[5],
                "wins": row[6],
                "total_games": total,
                "win_rate": win_rate,
            })

        return _ok({"players": players})

    # --- HISTORY ---
    if action == "history":
        auth = headers_raw.get("x-authorization") or headers_raw.get("authorization") or ""
        token = auth[7:] if auth.startswith("Bearer ") else None
        if not token:
            return _err(401, "Не авторизован")

        limit = min(int(body.get("limit", 20)), 100)

        conn = get_conn()
        cur = conn.cursor()
        user = get_user_by_token(token, cur)
        if not user:
            cur.close(); conn.close()
            return _err(401, "Сессия истекла")

        user_id = user[0]
        cur.execute(
            """SELECT mode, result, opponent, elo_delta, coins_earned, created_at
               FROM match_history WHERE user_id = %s
               ORDER BY created_at DESC LIMIT %s""",
            (user_id, limit)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()

        history = []
        for row in rows:
            history.append({
                "mode": MODE_LABEL.get(row[0], row[0]),
                "result": row[1],
                "opponent": row[2],
                "elo_delta": row[3],
                "coins_earned": row[4],
                "created_at": row[5].isoformat(),
            })

        return _ok({"history": history})

    return _err(400, "Неизвестное действие")


def _calc_rank(elo: int) -> str:
    if elo < 800:   return "Новичок"
    if elo < 1000:  return "Любитель"
    if elo < 1200:  return "Боец"
    if elo < 1400:  return "Ветеран"
    if elo < 1600:  return "Мастер"
    if elo < 1800:  return "Грандмастер"
    return "Легенда"


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def _err(code: int, message: str) -> dict:
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": message}, ensure_ascii=False)}
