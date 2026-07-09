from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify
from app.models import User

def premium_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not user.is_premium:
            return jsonify({
                "error": "Premium subscription required",
                "code": "PREMIUM_REQUIRED"
            }), 403

        return fn(*args, **kwargs)

    return wrapper