from datetime import date
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.decorators import premium_required
from app.models import User, UserPreference, MealPlan, MealPlanEntry, Recipe, Ingredient, Food
from app.services.openai_service import generate_meal_plan
from app.services.food_catalog_service import get_filtered_catalog
from app.extensions import db

ai_bp = Blueprint("ai", __name__)


def _contains_allergen(text_list, allergies):
    joined = " ".join(text_list).lower()
    return [a for a in allergies if a.lower() in joined]


def _sanitize_ingredients(raw_list, max_items=10, max_len=40, min_len=3):
    if not isinstance(raw_list, list):
        return []
    cleaned = []
    for item in raw_list:
        if not isinstance(item, str):
            continue
        item = item.strip()[:max_len]
        if len(item) >= min_len:
            cleaned.append(item)
        if len(cleaned) >= max_items:
            break
    return cleaned


def _find_invalid_food_ids(plan_data, valid_ids):
    invalid = set()
    for day in plan_data.get("days", []):
        for meal in day.get("meals", []):
            for ing in meal.get("ingredients", []):
                fid = ing.get("food_id")
                if fid not in valid_ids:
                    invalid.add(fid)
    return invalid


def _validate_plan_against_allergies_by_food(plan_data, allergies, lang):
    if not allergies:
        return []

    issues = []
    for day in plan_data.get("days", []):
        for meal in day.get("meals", []):
            food_ids = [ing["food_id"] for ing in meal.get("ingredients", [])]
            foods = Food.query.filter(Food.id.in_(food_ids)).all()
            names = [f.to_dict(lang=lang)["name"] for f in foods]
            found = _contains_allergen(names + [meal.get("name", "")], allergies)
            if found:
                issues.append({
                    "day": day.get("day"),
                    "meal_type": meal.get("type"),
                    "meal_name": meal.get("name"),
                    "matched_allergens": found,
                })
    return issues


@ai_bp.route("/generate-plan", methods=["POST"])
@premium_required
def generate_plan():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json() or {}

    lang = data.get("lang", "en")
    max_calories_per_meal = data.get("max_calories_per_meal", 700)
    preferred_ingredients = _sanitize_ingredients(data.get("preferred_ingredients", []))
    days = data.get("days", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])

    if not days or not isinstance(days, list):
        return jsonify({"error": "days must be a non-empty list"}), 400

    preferences = user.preferences
    saved_allergies = preferences.allergies if preferences else []
    dietary_style = preferences.dietary_style if preferences else None

    request_allergies = data.get("allergies", [])
    all_allergies = list(set(saved_allergies + request_allergies))

    catalog = get_filtered_catalog(preferred_ingredients, lang=lang)
    catalog_ids = {f["id"] for f in catalog}

    try:
        plan_data = generate_meal_plan(
            days=days,
            max_calories_per_meal=max_calories_per_meal,
            catalog=catalog,
            allergies=all_allergies,
            dietary_style=dietary_style,
            lang=lang,
        )
    except Exception as e:
        return jsonify({"error": "AI generation failed", "detail": str(e)}), 502

    invalid_ids = _find_invalid_food_ids(plan_data, catalog_ids)
    if invalid_ids:
        return jsonify({
            "error": "AI returned unknown ingredient ids",
            "detail": list(invalid_ids),
        }), 502

    issues = _validate_plan_against_allergies_by_food(plan_data, all_allergies, lang)

    return jsonify({
        "plan": plan_data,
        "allergy_warnings": issues,
    }), 200


@ai_bp.route("/plans", methods=["POST"])
@premium_required
def save_plan():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    plan_data = data.get("plan")
    week_start_date_str = data.get("week_start_date")
    lang = data.get("lang", "en")

    if not plan_data:
        return jsonify({"error": "Missing plan data"}), 400

    week_start_date = date.fromisoformat(week_start_date_str) if week_start_date_str else date.today()

    meal_plan = MealPlan(user_id=user_id, week_start_date=week_start_date)
    db.session.add(meal_plan)
    db.session.flush()

    try:
        for day in plan_data.get("days", []):
            for meal in day.get("meals", []):
                recipe = Recipe(
                    user_id=user_id,
                    name=meal.get("name", "AI meal"),
                    name_es=meal.get("name") if lang == "es" else None,
                )
                db.session.add(recipe)
                db.session.flush()

                for ing in meal.get("ingredients", []):
                    ingredient = Ingredient(
                        recipe_id=recipe.id,
                        food_id=ing["food_id"],
                        quantity=ing["quantity"],
                    )
                    db.session.add(ingredient)

                entry = MealPlanEntry(
                    day_of_week=day["day"],
                    meal_type=meal["type"],
                    meal_plan_id=meal_plan.id,
                    recipe_id=recipe.id,
                )
                db.session.add(entry)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save plan", "detail": str(e)}), 500

    return jsonify(meal_plan.to_dict()), 201


@ai_bp.route("/preferences", methods=["GET"])
@jwt_required()
def get_preferences():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user.preferences:
        return jsonify(None), 200

    return jsonify(user.preferences.to_dict()), 200


@ai_bp.route("/preferences", methods=["PUT"])
@jwt_required()
def update_preferences():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    preferences = UserPreference.query.filter_by(user_id=user_id).first()
    if not preferences:
        preferences = UserPreference(user_id=user_id)
        db.session.add(preferences)

    preferences.allergies = _sanitize_ingredients(data.get("allergies", []), max_items=20)
    preferences.preferred_ingredients = _sanitize_ingredients(data.get("preferred_ingredients", []))
    preferences.max_calories_per_meal = data.get("max_calories_per_meal")
    preferences.dietary_style = data.get("dietary_style")

    db.session.commit()

    return jsonify(preferences.to_dict()), 200