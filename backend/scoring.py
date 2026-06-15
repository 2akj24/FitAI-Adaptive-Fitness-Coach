from database import get_conn


def rows_to_dicts(cursor, rows):
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


def update_score(user_id, followed_diet, workout_done):
    conn = get_conn()
    cursor = conn.cursor()

    points = 0

    if followed_diet:
        points += 5

    if workout_done:
        points += 5

    cursor.execute("""
        INSERT INTO progress (user_id, score, followed_diet, workout_done)
        VALUES (%s, %s, %s, %s)
    """, (user_id, points, int(followed_diet), int(workout_done)))

    conn.commit()

    cursor.execute("""
        SELECT SUM(score) FROM progress WHERE user_id = %s
    """, (user_id,))

    total = cursor.fetchone()[0] or 0

    cursor.close()
    conn.close()

    return total


def adjust_plan_based_on_score(score, plan):
    if score >= 50:
        plan["calories"] += 100
        plan["protein"] += 5
        plan["level"] = "Advanced"
    elif score >= 20:
        plan["level"] = "Intermediate"
    else:
        plan["level"] = "Beginner"

    return plan


def get_user_history(user_id):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT score, followed_diet, workout_done, logged_at
        FROM progress
        WHERE user_id = %s
        ORDER BY logged_at DESC
        LIMIT 10
    """, (user_id,))

    rows = cursor.fetchall()
    history = rows_to_dicts(cursor, rows)

    cursor.close()
    conn.close()

    return history