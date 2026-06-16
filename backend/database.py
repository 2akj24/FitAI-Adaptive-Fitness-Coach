import psycopg2
import os
from dotenv import load_dotenv

try:
    from indian_meals_700_python_list import meals
except Exception:
    meals = []

load_dotenv()


def get_conn():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return psycopg2.connect(database_url)

    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "fitai"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        port=os.getenv("DB_PORT", "5432")
    )

def create_table():
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
                    CREATE TABLE IF NOT EXISTS user_plans (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                        plan_data JSONB NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        age INTEGER,
        weight REAL,
        height REAL,
        goal TEXT,
        diet_type TEXT,
        activity_level TEXT,
        budget TEXT,
        region TEXT,
        time_pref TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Safe migration for old users table
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT")
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT")
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT")
    cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT")

    cursor.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique
    ON users (LOWER(username))
    WHERE username IS NOT NULL
    """)

    cursor.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
    ON users (LOWER(email))
    WHERE email IS NOT NULL
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        calories INTEGER,
        protein INTEGER,
        region TEXT,
        budget TEXT,
        time_pref TEXT,
        diet_type TEXT,
        meal_time TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        followed_diet INTEGER DEFAULT 0,
        workout_done INTEGER DEFAULT 0,
        notes TEXT,
        tracked_date DATE DEFAULT CURRENT_DATE,
        logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("ALTER TABLE progress ADD COLUMN IF NOT EXISTS notes TEXT")
    cursor.execute("ALTER TABLE progress ADD COLUMN IF NOT EXISTS tracked_date DATE DEFAULT CURRENT_DATE")

    # Remove duplicate old progress rows before adding calendar-wise unique index.
    cursor.execute("""
    DELETE FROM progress a
    USING progress b
    WHERE a.id < b.id
    AND a.user_id = b.user_id
    AND a.tracked_date = b.tracked_date
    """)

    cursor.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS progress_user_date_unique
    ON progress (user_id, tracked_date)
    """)

    conn.commit()

    if meals:
        seed_meals(cursor)
        conn.commit()

    cursor.close()
    conn.close()


def seed_meals(cursor):
    cursor.executemany("""
    INSERT INTO meals
    (name, calories, protein, region, budget, time_pref, diet_type, meal_time)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (name) DO UPDATE SET
        calories = EXCLUDED.calories,
        protein = EXCLUDED.protein,
        region = EXCLUDED.region,
        budget = EXCLUDED.budget,
        time_pref = EXCLUDED.time_pref,
        diet_type = EXCLUDED.diet_type,
        meal_time = EXCLUDED.meal_time
    """, meals)
