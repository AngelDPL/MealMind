from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.services.stripe_service import create_chechout_session, create_portal_session

subscription_bp = Blueprint("subscription", __name__)

@subscription_bp.route("/create-checkout-session", methods=["POST"])
@jwt_required()
def create_checkout():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User nor found"}), 404

    if user.is_premium:
        return jsonify({"error": "User already has an active subscription"}), 404

    session = create_chechout_session(user)
    return jsonify({"checkout_url": session.url}), 200


@subscription_bp.route("/create-portal-session", methods=["POST"])
@jwt_required()
def create_portal():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.subscription or not user.subscription.stripe_customer_id:
        return jsonify({"error": "No subscription found"}), 404

    session = create_portal_session(user.subscription.stripe_customer_id)
    return jsonify({"portal_url": session.url}), 200