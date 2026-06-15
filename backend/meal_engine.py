from database import get_conn


def rows_to_dicts(cursor, rows):
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


def get_budget_list(budget):
    budget_map = {
        "low": ["low"],
        "medium": ["low", "medium"],
        "high": ["low", "medium", "high"]
    }
    return budget_map.get(budget, ["low"])


def get_region_list(region):
    region_map = {
        "north": ["north", "punjab", "rajasthan", "himachal", "kashmir"],
        "south": ["south", "tamil_nadu", "kerala", "andhra", "telangana"],
        "east": ["bengal", "bihar", "odisha", "assam", "northeast"],
        "west": ["maharashtra", "gujarat", "goa"],
        "central": ["central"],
        "all": [
            "all", "north", "punjab", "rajasthan", "himachal", "kashmir",
            "south", "tamil_nadu", "kerala", "andhra", "telangana",
            "bengal", "bihar", "odisha", "assam", "northeast",
            "maharashtra", "gujarat", "goa", "central"
        ]
    }
    return region_map.get(region, [region])


def filter_meals(user, target_calories):
    conn = get_conn()
    cursor = conn.cursor()

    region = user.get("region", "all")
    budget = user.get("budget", "low")
    diet_type = user.get("diet_type", "veg")

    regions = get_region_list(region)
    budgets = get_budget_list(budget)

    cursor.execute("""
        SELECT * FROM meals
        WHERE diet_type = %s
        AND budget = ANY(%s)
        AND (region = ANY(%s) OR region = 'all')
        ORDER BY meal_time, protein DESC, calories ASC
    """, (diet_type, budgets, regions))

    all_meals = rows_to_dicts(cursor, cursor.fetchall())

    cursor.close()
    conn.close()

    return all_meals
