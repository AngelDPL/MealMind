from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from app.extensions import db
from app.models.recipe import   Recipe, Ingredient
from app.models.food import Food

recipes_bp = Blueprint("recipes", __name__)


@recipes_bp.route("/", methods=["GET"])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    lang = request.args.get("lang", "en")
    recipes = db.session.execute(
        select(Recipe).where(Recipe.user_id == user_id)
    ).scalars().all()
    return jsonify([r.to_dict(lang=lang) for r in recipes]), 200


@recipes_bp.route("/", methods=["POST"])
@jwt_required()
def create_recipe():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or "name" not in data:
        return jsonify({"error": "Name is required"})
    
    recipe = Recipe(
        name=data["name"],
        description=data.get("description"),
        user_id=user_id
    )
    db.session.add(recipe)
    db.session.flush()
    
    for ing in data.get("ingredients", []):
        food = db.session.get(Food, ing["food_id"])
        if not food:
            continue
        ingredient = Ingredient(
            food_id=ing["food_id"],
            quantity=ing["quantity"],
            recipe_id=recipe.id
        )
        db.session.add(ingredient)
        
    db.session.commit()
    return jsonify(recipe.to_dict()), 201


@recipes_bp.route("/<int:recipe_id>", methods=["PUT"])
@jwt_required()
def update_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = db.session.execute(
        select(Recipe).where(Recipe.id == recipe_id, Recipe.user_id == user_id)
    ).scalars_one_or_none()
    
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    
    data = request.get_json()
    
    recipe.name = data.get("name", recipe.name)
    recipe.description = data.get("description", recipe.description)
    
    if "ingredients" in data:
        for ing in recipe.ingredients:
            db.session.delete(ing)
    db.session.flush()
    
    for ing in data["ingredients"]:
        food = db.session.get(Food, ing["food_id"])
        if not food:
            continue
        ingredient = Ingredient(
            food_id=ing["food_id"],
            quantity=ing["quantity"],
            recipe_id=recipe.id
        )
        db.session.add(ingredient)
        
    db.session.commit()
    return jsonify(recipe.to_dict()), 200


@recipes_bp.route("/<int:recipe_id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = db.session.execute(
        select(Recipe).where(Recipe.id == recipe_id, Recipe.user_id == user_id)
    ).scalar_one_or_none()
    
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"messaje": "Recipe deleted successfully"}), 200