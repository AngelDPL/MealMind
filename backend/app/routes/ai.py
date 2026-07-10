from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.decorators import premium_required
from app.models import User, AIGeneratedPlan, UserPreference
from app.services.openai_service import generate_meal_plan
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

ai_bp = Blueprint("ai", __name__)


def _contains_allergen(text_list, allergies):
    joined = " ".join(text_list).lower()
    return [a for a in allergies if a.lower() in joined]


def _validate_plan_against_allergies(plan_data, allergies):
    if not allergies:
        return []

    issues = []
    for day in plan_data.get("days", []):
        for meal in day.get("meals", []):
            check_text = meal.get("ingredients", []) + [meal.get("name", "")]
            found = _contains_allergen(check_text, allergies)
            if found:
                issues.append({
                    "day": day.get("day"),
                    "meal_type": meal.get("type"),
                    "meal_name": meal.get("name"),
                    "matched_allergens": found,
                })
    return issues


def _sanitize_ingredients(raw_list, max_items=10, max_len=40):
    if not isinstance(raw_list, list):
        return []
    cleaned = []
    for item in raw_list:
        if not isinstance(item, str):
            continue
        item = item.strip()[:max_len]
        if item:
            cleaned.append(item)
        if len(cleaned) >= max_items:
            break
    return cleaned


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

    try:
        plan_data = generate_meal_plan(
            days=days,
            max_calories_per_meal=max_calories_per_meal,
            preferred_ingredients=preferred_ingredients,
            allergies=all_allergies,
            dietary_style=dietary_style,
            lang=lang,
        )
    except Exception as e:
        return jsonify({"error": "AI generation failed", "detail": str(e)}), 502

    issues = _validate_plan_against_allergies(plan_data, all_allergies)

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
    if not plan_data:
        return jsonify({"error": "Missing plan data"}), 400

    ai_plan = AIGeneratedPlan(
        user_id=user_id,
        plan_data=plan_data,
        max_calories_per_meal=data.get("max_calories_per_meal"),
    )
    db.session.add(ai_plan)
    db.session.commit()

    return jsonify(ai_plan.to_dict()), 201


@ai_bp.route("/plans", methods=["GET"])
@premium_required
def list_plans():
    user_id = get_jwt_identity()
    plans = AIGeneratedPlan.query.filter_by(user_id=user_id).order_by(AIGeneratedPlan.created_at.desc()).all()
    return jsonify([p.to_dict() for p in plans]), 200


@ai_bp.route("/plans/<int:plan_id>", methods=["DELETE"])
@premium_required
def delete_plan(plan_id):
    user_id = get_jwt_identity()
    plan = AIGeneratedPlan.query.filter_by(id=plan_id, user_id=user_id).first()

    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    db.session.delete(plan)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


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