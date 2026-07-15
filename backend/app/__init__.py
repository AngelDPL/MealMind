from flask import Flask, jsonify
from .extensions import db, jwt, cors, migrate, limiter
from config import Config
from sqlalchemy import select as sa_select


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://meal-mind-seven.vercel.app",
        "https://mealmind.cc",
        "https://www.mealmind.cc"
    ]}})
    migrate.init_app(app, db)
    limiter.init_app(app)

    from .routes.auth import auth_bp
    from .routes.recipes import recipes_bp
    from .routes.meal_plans import meal_plan_bp
    from .routes.shopping import shopping_bp
    from .routes.foods import foods_bp
    from .routes.subscription import subscription_bp
    from .routes.stripe_webhook import stripe_webhook_bp
    from .routes.ai import ai_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(meal_plan_bp, url_prefix="/api/meal-plan")
    app.register_blueprint(shopping_bp, url_prefix="/api/shopping")
    app.register_blueprint(foods_bp, url_prefix="/api/foods")
    app.register_blueprint(subscription_bp, url_prefix="/api/subscription")
    app.register_blueprint(stripe_webhook_bp, url_prefix="/api/stripe")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    with app.app_context():
        from .models import (
            User,
            Food,
            Recipe,
            Ingredient,
            MealPlan,
            MealPlanEntry,
            ShoppingItem,
        )

        db.create_all()

        if not db.session.execute(sa_select(Food)).first():
            from seed_foods import FOODS
            for f in FOODS:
                exists = db.session.execute(
                    sa_select(Food).where(Food.name == f['name'])
                ).scalar_one_or_none()
                if not exists:
                    db.session.add(Food(**f))
            db.session.commit()
            print("[SEED] Foods seeded automatically")

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({"error": "Too many requests. Please try again later."}), 429

    return app