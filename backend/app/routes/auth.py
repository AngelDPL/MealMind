from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from app.extensions import db
from app.models import User
from app.utils import create_starter_recipes
from app.emails import (
    send_welcome_email,
    send_email_change_confirmation,
    send_password_reset_email
)

auth_bp = Blueprint("auth", __name__)


def validate_fields(data, fields):
    return data and all(k in data and data[k] for k in fields)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if not validate_fields(data, ["email", "username", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if data["password"] != data["confirm_password"]:
        return jsonify({"error": "Password do not match"}), 400
    
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
    db.session.flush()
    
    create_starter_recipes(user.id)
    
    try:
        send_welcome_email(user.email, user.username, data["password"])
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")

    return jsonify({"message": "User created successfully", "user": user.to_dict()}), 201


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


@auth_bp.route("/request-email-change", methods=["POST"])
@jwt_required()
def reques_email_change():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    data = request.get_json()
    print("DATA RECIBIDA:", data)
    print("USER:", user.email)
    new_email = data.get("new_email")
    
    if not new_email:
        return jsonify({"error": "New email is required"}), 400
    
    if not user.check_password(data.get("password", "")):
        return jsonify({"error": "Incorrect password"}), 401
    
    if db.session.execute(
        select(User).where(User.email == new_email)
    ).scalar_one_or_none():
        jsonify({"error": "Email already in use"}), 409
        
    user.pending_email = new_email
    token = user.generate_email_token()
    db.session.commit()
    
    try:
        send_email_change_confirmation(new_email, user.username, token)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return jsonify({"error": "Could not send confirmation email"}), 500
    
    return jsonify({"message": "Confirmation email snet to new address"}), 200


@auth_bp.route("/confirm-email", methods=["GET"])
def confirm_email():
    token = request.args.get("token")
    
    if not token:
        return jsonify({"error": "Token not provided"}), 400
    
    user = db.session.execute(
        select(User).where(User.email_confirm_token == token)
    ).scalar_one_or_none()
    
    if not user or not user.pending_email:
        return jsonify({"error": "Invalid or expired token"})
    
    user.email = user.pending_email
    user.pending_email = None
    user.email_confirm_token = None
    db.session.commit()
    
    return jsonify({"message": "Email updated successfully"}), 200


@auth_bp.route("/change-password", methods=["PATCH"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    data = request.get_json()
    print("data recibida:", data)
    
    if not user.check_password(data.get("current_password", "")):
        return jsonify({"error": "Current password is incorrect"}), 401
    
    if data.get("new_password") != data.get("confirm_password"):
        return jsonify({"error": "Password do not match"}), 400
    
    user.set_password(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    user = db.session.execute(
        select(User).where(User.email == data.get("email"))
    ).scalar_one_or_none()
    
    if user:
        token = user.generate_reset_token()
        db.session.commit()
        try:
            send_password_reset_email(user.email, user.username, token)
        except Exception as e:
            print(f"[EMAIL ERROR] {e}")
            
    return jsonify({"message": "If that email exists, you will receive a reset link"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    
    user = db.session.execute(
        select(User).where(User.password_reset_token == token)
    ).scalar_one_or_none()
    
    if not user:
        return jsonify({"error": "Invalid or expired token"}), 400
    
    if data.get("new_password") != data.get("confirm_password"):
        return jsonify({"error": "Password do not match"}), 400
    
    user.set_password(data["new_password"])
    user.password_reset_token = None
    db.session.commit()
    
    return jsonify({"message": "Password reset successfully"}), 200 