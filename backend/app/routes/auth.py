from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from app.extensions import db
from app.models import User

auth_bp = Blueprint("auth", __name__)


def validate_fields(data, fields):
    return data and all(k in data and data[k] for k in fields)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if not validate_fields(data, ["email", "username", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if db.session.execute(
        select(User).where(User.email == data["email"])
    ).scalar_one_or_none():
        return jsonify({"error": "Email already registered"}), 409
    
    if db.session.execute(
        select(User).where(User.username == data["username"])
    ).scalar_one_or_none():
        return jsonify({"error": "Username already taken"}), 409
    
    user = User(
        username = data["username"],
        email = data["email"]
    )
    user.set_password(data["password"])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"Message": "User created successfully", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    
    if not validate_fields(data, ["email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    user = db.session.execute(
        select(User).where(User.email == data["email"])
    ).scalar_one_or_none()
    
    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    
    is_first = user.first_login
    
    if user.first_login:
        user.first_login = False
        db.session.commit()
        
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "access_token": token,
        "user": user.to_dict(),
        "first_login": is_first
    }), 200
    
    
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    return jsonify(user.to_dict()), 200


@auth_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_info():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    data = request.get_json()
    
    if "username" in data:
        existing = db.session.execute(
            select(User).where(User.username == data["username"])
        ).scalar_one_or_none()
        if existing and existing.id != user.id:
            return jsonify({"error": "Username already taken"}), 409
        user.username = data["username"]
        
    if "email" in data:
        existing = db.session.execute(
            select(User).where(User.email == data["email"])
        ).scalar_one_or_none()
        if existing and existing.id != user.id:
            return jsonify({"error": "Email already taken"}), 409
        user.email = data["email"]
        
    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/change-password", methods=["PATCH"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    data = request.get_json()
    
    if not user.check_password(data.get("current_password", "")):
        return ({"error": "Current password is incorrect"}), 401
    
    user.set_password(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200