from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from app.extensions import db
from app.models.shopping import ShoppingItem
from app.models.meal_plan import MealPlan

shopping_bp = Blueprint("shopping", __name__)


@shopping_bp.route("/generate/<int:plan_id>", methods=["POST"])
@jwt_required()
def generate_shopping_list(plan_id):
    user_id = get_jwt_identity()
    lang = request.args.get("lang", "en")
    plan = db.session.execute(
        select(MealPlan).where(MealPlan.id == plan_id, MealPlan.user_id == user_id)
    ).scalar_one_or_none()

    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    existing = (
        db.session.execute(
            select(ShoppingItem).where(ShoppingItem.meal_plan_id == plan_id)
        )
        .scalars()
        .all()
    )
    for item in existing:
        db.session.delete(item)
    db.session.flush()

    items = {}
    for entry in plan.entries:
        if not entry.recipe:
            continue
        for ing in entry.recipe.ingredients:
            if lang == "es":
                name = ing.food.name
            else:
                name = ing.food.name_en or ing.food.name
            key = (name, ing.food.unit)
            if key in items:
                items[key] += ing.quantity
            else:
                items[key] = ing.quantity

    for (name, unit), quantity in items.items():
        item = ShoppingItem(
            name=name, quantity=round(quantity, 1), unit=unit, meal_plan_id=plan_id
        )
        db.session.add(item)

    db.session.commit()

    result = (
        db.session.execute(
            select(ShoppingItem).where(ShoppingItem.meal_plan_id == plan_id)
        )
        .scalars()
        .all()
    )
    return jsonify([i.to_dict() for i in result]), 201


@shopping_bp.route("/<int:plan_id>", methods=["GET"])
@jwt_required()
def get_shopping_list(plan_id):
    user_id = get_jwt_identity()
    plan = db.session.execute(
        select(MealPlan).where(MealPlan.id == plan_id, MealPlan.user_id == user_id)
    ).scalar_one_or_none()

    if not plan:
        return jsonify({"error": "Plan not found"}), 404

    items = (
        db.session.execute(
            select(ShoppingItem).where(ShoppingItem.meal_plan_id == plan_id)
        )
        .scalars()
        .all()
    )
    return jsonify([i.to_dict() for i in items]), 200


@shopping_bp.route("/item/<int:item_id>/toggle", methods=["PATCH"])
@jwt_required()
def toggle_item(item_id):
    item = db.session.get(ShoppingItem, item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    item.checked = not item.checked
    db.session.commit()
    return jsonify(item.to_dict()), 200
