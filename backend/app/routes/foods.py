from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import select, or_
from app.extensions import db
from app.models.food import Food

foods_bp = Blueprint("foods", __name__)


@foods_bp.route("/", methods=["GET"])
@jwt_required()
def get_foods():
    search = request.args.get("q","")
    lang = request.args.get("lang", "es")
    
    if search:
        stmt = select(Food).where(
            or_(
                Food.name.ilike(f"%{search}%"),
                Food.name_en.ilike(f"%{search}%")
            )
        ).limit(20)
    else:
        stmt = select(Food).order_by(Food.name). limit(50)
        
    foods = db.session.execute(stmt).scalars().all()
    return jsonify([f.to_dict(lang=lang) for f in foods]), 200


@foods_bp.route("/categories", methods=["GET"])
@jwt_required()
def get_categories():
    lang = request.args.get("lang", "es")
    foods = db.session.execute(select(Food)).scalars().all()
    if lang == 'en':
        categories = sorted(set(f.category_en for f in foods if f.category_en))
    else:
        categories = sorted(set(f.category for f in foods if f.category))
    return jsonify(categories), 200