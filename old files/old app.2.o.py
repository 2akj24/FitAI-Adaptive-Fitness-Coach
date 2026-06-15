from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pathlib import Path
try:
    from backend.database import create_table, get_conn
    from backend.engine import generate_plan
    from backend.meal_engine import filter_meals
    from backend.scoring import adjust_plan_based_on_score, update_score, get_user_history
except ModuleNotFoundError:
    from database import create_table, get_conn
    from engine import generate_plan
    from meal_engine import filter_meals
    from scoring import adjust_plan_based_on_score, update_score, get_user_history


app = Flask(__name__)
CORS(app)

load_dotenv()
create_table()


def save_user(data):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users 
        (age, weight, height, goal, diet_type, activity_level, budget, region, time_pref)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        data.get("age"),
        data.get("weight"),
        data.get("height"),
        data.get("goal"),
        data.get("diet_type"),
        data.get("activity_level"),
        data.get("budget"),
        data.get("region"),
        data.get("time_pref")
    ))

    user_id = cursor.fetchone()[0]
    conn.commit()

    cursor.close()
    conn.close()

    return user_id


def generate_workout_plan(activity_level):
    if activity_level == "low":
        return """
Day 1: Full Body
- Bodyweight Squats: 3 sets x 12 reps
- Push-ups: 3 sets x 8 reps
- Plank: 3 sets x 30 seconds

Day 2: Rest + 20 minute walk

Day 3: Upper Body
- Incline Push-ups: 3 sets x 10 reps
- Dumbbell Shoulder Press: 3 sets x 12 reps
- Dumbbell Rows: 3 sets x 12 reps

Day 4: Rest

Day 5: Lower Body
- Squats: 3 sets x 12 reps
- Lunges: 3 sets x 10 reps
- Calf Raises: 3 sets x 15 reps

Day 6: Light walk + stretching

Day 7: Rest
"""

    elif activity_level == "moderate":
        return """
Day 1: Upper Body
- Bench Press / Push-ups: 4 sets x 10 reps
- Rows: 4 sets x 10 reps
- Shoulder Press: 3 sets x 12 reps
- Biceps Curls: 3 sets x 12 reps

Day 2: Lower Body
- Squats: 4 sets x 10 reps
- Lunges: 3 sets x 12 reps
- Leg Curl: 3 sets x 12 reps
- Calf Raises: 4 sets x 15 reps

Day 3: Rest / Walk

Day 4: Upper Body
- Incline Press: 4 sets x 10 reps
- Lat Pulldown: 4 sets x 10 reps
- Lateral Raises: 3 sets x 15 reps
- Triceps Pushdown: 3 sets x 12 reps

Day 5: Lower Body
- Deadlift: 3 sets x 8 reps
- Leg Press: 4 sets x 10 reps
- Hamstring Curl: 3 sets x 12 reps
- Abs: 3 sets

Day 6: Cardio + Mobility

Day 7: Rest
"""

    return """
Day 1: Push
- Bench Press: 4 sets x 8-10 reps
- Shoulder Press: 4 sets x 10 reps
- Incline Dumbbell Press: 3 sets x 12 reps
- Triceps Pushdown: 3 sets x 12 reps

Day 2: Pull
- Pull-ups / Lat Pulldown: 4 sets x 10 reps
- Barbell Rows: 4 sets x 10 reps
- Face Pulls: 3 sets x 15 reps
- Biceps Curls: 3 sets x 12 reps

Day 3: Legs
- Squats: 4 sets x 8-10 reps
- Romanian Deadlift: 4 sets x 10 reps
- Leg Press: 3 sets x 12 reps
- Calf Raises: 4 sets x 15 reps

Day 4: Push
- Incline Press: 4 sets x 10 reps
- Lateral Raises: 3 sets x 15 reps
- Triceps Dips: 3 sets x 12 reps

Day 5: Pull
- Seated Rows: 4 sets x 10 reps
- Lat Pulldown: 4 sets x 10 reps
- Hammer Curls: 3 sets x 12 reps

Day 6: Legs
- Leg Press: 4 sets x 10 reps
- Lunges: 3 sets x 12 reps
- Calf Raises: 4 sets x 15 reps

Day 7: Rest
"""


def calculate_bmi(weight, height):
    height_m = height / 100
    bmi = weight / (height_m * height_m)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Healthy"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return round(bmi, 1), category


def build_greeting(data, bmi, bmi_category):
    goal_text = {
        "fat_loss": "fat loss",
        "muscle_gain": "muscle gain",
        "maintain": "maintenance"
    }.get(data["goal"], data["goal"])

    return (
        f"Based on your age {data['age']}, weight {data['weight']} kg, "
        f"height {data['height']} cm and BMI {bmi} ({bmi_category}), "
        f"this plan is personalized for {goal_text}, {data['activity_level']} activity, "
        f"{data['diet_type']} diet, {data['budget']} budget and {data['region']} food preference."
    )


def meal_reason(meal, goal):
    if goal == "fat_loss":
        return "Supports calorie control while keeping the meal filling."
    elif goal == "muscle_gain":
        return "Helps increase protein intake and supports muscle recovery."
    return "Keeps your nutrition balanced and sustainable."


def daily_motivation(day_index):
    quotes = [
        "Start strong and keep it simple.",
        "Small consistency beats big motivation.",
        "Fuel your body, don’t punish it.",
        "One good meal at a time.",
        "Progress comes from repeatable habits.",
        "Stay disciplined, not extreme.",
        "Finish the week stronger than you started."
    ]
    return quotes[day_index % len(quotes)]


def get_calorie_distribution(target_calories):
    return {
        "Early Morning": int(target_calories * 0.10),
        "Breakfast": int(target_calories * 0.25),
        "Lunch": int(target_calories * 0.30),
        "Evening Snack": int(target_calories * 0.10),
        "Dinner": int(target_calories * 0.25)
    }


def get_early_morning_keywords():
    return [
        "shake", "smoothie", "drink", "sattu", "lassi",
        "banana", "milk", "yogurt", "nuts", "fruit",
        "coffee", "tea", "lemon", "water", "protein"
    ]


def pick_best_meal(options, slot_target, used_names, day_index):
    available = [m for m in options if m["name"] not in used_names]

    if not available:
        available = options[:]

    if not available:
        return None

    # Prefer meals close to the slot calorie target, then rotate by day for variety.
    available.sort(key=lambda m: abs(int(m.get("calories", 0)) - slot_target))

    top_pool = available[:min(8, len(available))]
    selected = top_pool[day_index % len(top_pool)]

    used_names.add(selected["name"])
    return selected


def build_7_day_diet_plan(meals, user_goal, target_calories=2000):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    calorie_targets = get_calorie_distribution(target_calories)

    slot_db_time = {
        "Breakfast": "breakfast",
        "Lunch": "lunch",
        "Evening Snack": "snack",
        "Dinner": "dinner"
    }

    diet_plan = []

    if not meals:
        return diet_plan

    for day_index, day in enumerate(days):
        used_names = set()
        daily_meals = []

        for slot in ["Early Morning", "Breakfast", "Lunch", "Evening Snack", "Dinner"]:
            slot_target = calorie_targets[slot]

            if slot == "Early Morning":
                keywords = get_early_morning_keywords()
                options = [
                    m for m in meals
                    if any(k in str(m["name"]).lower() for k in keywords)
                ]

                # Fallback: light snacks or breakfast items only.
                if not options:
                    options = [
                        m for m in meals
                        if str(m.get("meal_time", "")).lower() in ["snack", "breakfast"]
                    ]
            else:
                db_time = slot_db_time[slot]
                options = [
                    m for m in meals
                    if str(m.get("meal_time", "")).lower() == db_time
                ]

            meal = pick_best_meal(options, slot_target, used_names, day_index)

            if not meal:
                continue

            daily_meals.append({
                "time": slot,
                "name": meal["name"],
                "calories": meal["calories"],
                "protein": meal["protein"],
                "target_calories": slot_target,
                "reason": meal_reason(meal, user_goal)
            })

        diet_plan.append({
            "day": day,
            "motivation": daily_motivation(day_index),
            "meals": daily_meals,
            "total_calories": sum(m["calories"] for m in daily_meals),
            "total_protein": sum(m["protein"] for m in daily_meals)
        })

    return diet_plan

def parse_workout_plan(workout_text):
    lines = [line.strip() for line in workout_text.split("\n") if line.strip()]

    workout_plan = []
    current_day = None

    for line in lines:
        if line.startswith("Day"):
            current_day = {
                "day": line.split(":")[0],
                "title": line,
                "exercises": []
            }
            workout_plan.append(current_day)
        elif current_day and line.startswith("-"):
            current_day["exercises"].append(line.replace("- ", ""))

    return workout_plan


def build_tips(data, bmi_category):
    goal = data.get("goal", "fitness").replace("_", " ")

    tips = [
        f"Your current focus is {goal}, so consistency matters more than extreme dieting.",
        f"Your plan is adjusted for {data.get('activity_level')} activity and {data.get('budget')} budget.",
        "Drink enough water throughout the day.",
        "Sleep 7-8 hours for better recovery.",
        "Track your meals and workout completion weekly."
    ]

    if bmi_category == "Underweight":
        tips.append("Focus on nutrient-dense meals and avoid skipping meals.")
    elif bmi_category == "Overweight":
        tips.append("Keep portions controlled and stay consistent with walking or workouts.")
    elif bmi_category == "Obese":
        tips.append("Start gradually and focus on sustainable daily habits.")
    else:
        tips.append("Maintain your current healthy range with balanced meals and regular movement.")

    return tips


@app.route("/")
def index():
    return jsonify({
        "message": "FitAI Backend Running"
    })


@app.route("/get_plan", methods=["POST"])
def get_plan():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        data["age"] = int(data.get("age", 20))
        data["weight"] = float(data.get("weight", 70))
        data["height"] = float(data.get("height", 170))

        existing_user_id = data.get("user_id")

        if existing_user_id and str(existing_user_id).isdigit():
            user_id = int(existing_user_id)
        else:
            user_id = save_user(data)

        raw_plan = generate_plan(data)
        

        meals = filter_meals(data, raw_plan["calories"])
        raw_plan["meals"] = meals

        raw_plan = adjust_plan_based_on_score(0, raw_plan)

        bmi, bmi_category = calculate_bmi(data["weight"], data["height"])
        workout_text = generate_workout_plan(data.get("activity_level", "low"))
        region = data.get("region")

        final_plan = {
            "greeting": build_greeting(data, bmi, bmi_category),
            "summary": {
                "calories": raw_plan["calories"],
                "protein": raw_plan["protein"],
                "level": raw_plan["level"],
                "goal": data["goal"],
                "bmi": bmi,
                "bmi_category": bmi_category,
                "diet_type": data["diet_type"],
                "budget": data["budget"],
                "region": data["region"],
                "activity_level": data["activity_level"]
            },
            "diet_plan": build_7_day_diet_plan(meals, data["goal"], raw_plan["calories"]),
            "workout_plan": parse_workout_plan(workout_text),
            "tips": build_tips(data, bmi_category)
        }

        return jsonify({
            "plan": final_plan,
            "raw_plan": raw_plan,
            "user_id": user_id
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/update_progress", methods=["POST"])
def update_progress():
    try:
        data = request.get_json()

        user_id = data["user_id"]
        followed_diet = data["followed_diet"]
        workout_done = data["workout_done"]

        new_score = update_score(user_id, followed_diet, workout_done)

        return jsonify({"new_score": new_score})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/meals")
def api_meals():
    region = request.args.get("region", "all")
    diet = request.args.get("diet_type", "veg")
    budget = request.args.get("budget", "high")
    meal_time = request.args.get("meal_time", "all")
    min_protein = request.args.get("min_protein")
    max_calories = request.args.get("max_calories")

    regions = get_region_list(region)
    budgets = get_budget_list(budget)

    conn = get_conn()
    cursor = conn.cursor()

    query = """
        SELECT * FROM meals
        WHERE diet_type = %s
        AND budget = ANY(%s)
        AND (region = ANY(%s) OR region = 'all')
    """
    params = [diet, budgets, regions]

    if meal_time != "all":
        query += " AND meal_time = %s"
        params.append(meal_time)

    if min_protein:
        query += " AND protein >= %s"
        params.append(int(min_protein))

    if max_calories:
        query += " AND calories <= %s"
        params.append(int(max_calories))

    query += " ORDER BY meal_time, protein DESC, calories ASC"

    cursor.execute(query, params)

    columns = [desc[0] for desc in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify({
        "count": len(results),
        "meals": results
    })


@app.route("/api/all-meals")
def all_meals():
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM meals ORDER BY region, diet_type, calories")

    columns = [desc[0] for desc in cursor.description]
    meals = [dict(zip(columns, row)) for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify({
        "count": len(meals),
        "meals": meals
    })

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
        "all": ["all"]
    }

    return region_map.get(region, [region])

def is_early_morning_meal(meal_name):
    keywords = [
        "shake", "smoothie", "drink", "sattu", "lassi",
        "banana", "milk", "yogurt", "nuts", "fruit"
    ]

    name = meal_name.lower()
    return any(word in name for word in keywords)


@app.route("/api/blogs", methods=["GET"])
def get_blogs():
    blog_dir = Path(__file__).parent / "blogs"
    blogs = []

    if not blog_dir.exists():
        return jsonify({"blogs": []})

    blog_files = list(blog_dir.glob("*.txt"))

    for index, file_path in enumerate(blog_files):
        with open(file_path, "r", encoding="utf-8") as file:
            text = file.read()

        lines = text.splitlines()

        title = "Untitled Blog"
        category = "Fitness"
        author = "Abhinav Kumar"
        image = ""
        content_start = 0

        for i, line in enumerate(lines):
            if line.startswith("Title:"):
                title = line.replace("Title:", "").strip()
            elif line.startswith("Category:"):
                category = line.replace("Category:", "").strip()
            elif line.startswith("Author:"):
                author = line.replace("Author:", "").strip()
            elif line.startswith("Image:"):
                image = line.replace("Image:", "").strip()
            elif line.strip() == "":
                content_start = i + 1
                break

        content = "\n".join(lines[content_start:]).strip()

        blogs.append({
            "id": index + 1,
            "title": title,
            "category": category,
            "author": author,
            "image": image,
            "content": content
        })

    return jsonify({"blogs": blogs})


@app.route("/api/history/<int:user_id>")
def history(user_id):
    try:
        logs = get_user_history(user_id)

        return jsonify({
            "user_id": user_id,
            "logs": logs
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)