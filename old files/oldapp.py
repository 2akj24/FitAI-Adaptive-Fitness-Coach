from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

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


def build_7_day_diet_plan(meals, user_goal):
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    diet_plan = []

    for day_index, day in enumerate(days):

        used = set()

        def pick_meal(slot):

            if slot == "Early Morning":
                options = [
                    m for m in meals
                    if any(k in m["name"].lower() for k in [
                        "shake", "smoothie", "drink",
                        "banana", "yogurt", "nuts",
                        "sattu", "fruit"
                    ])
                    and m["name"] not in used
                ]

            elif slot == "Breakfast":
                options = [
                    m for m in meals
                    if m["meal_time"].lower() == "breakfast"
                    and m["name"] not in used
                ]

            elif slot == "Lunch":
                options = [
                    m for m in meals
                    if m["meal_time"].lower() == "lunch"
                    and m["name"] not in used
                ]

            elif slot == "Evening Snack":
                options = [
                    m for m in meals
                    if m["meal_time"].lower() == "snack"
                    and m["name"] not in used
                ]

            else:
                options = [
                    m for m in meals
                    if m["meal_time"].lower() == "dinner"
                    and m["name"] not in used
                ]

            if not options:
                options = [m for m in meals if m["name"] not in used]

            meal = options[day_index % len(options)]

            used.add(meal["name"])

            return {
                "time": slot,
                "name": meal["name"],
                "calories": meal["calories"],
                "protein": meal["protein"],
                "reason": meal_reason(meal, user_goal)
            }

        daily_meals = [
            pick_meal("Early Morning"),
            pick_meal("Breakfast"),
            pick_meal("Lunch"),
            pick_meal("Evening Snack"),
            pick_meal("Dinner")
        ]

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
            "diet_plan": build_7_day_diet_plan(meals, data["goal"]),
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

    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM meals
        WHERE (region = %s OR region = 'all')
        AND diet_type = %s
        ORDER BY protein DESC
    """, (region, diet))

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