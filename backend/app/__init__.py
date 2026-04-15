from flask import Flask
from .extensions import db, jwt, cors, migrate
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]}})
    migrate.init_app(app, db)
    
    from .routes.auth import auth_bp
    from .routes.recipes import recipes_bp
    from .routes.meal_plans import meal_plan_bp
    from .routes.shopping import shopping_bp
    from .routes.foods import foods_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(meal_plan_bp, url_prefix="/api/meal-plan")
    app.register_blueprint(shopping_bp, url_prefix="/api/shopping")
    app.register_blueprint(foods_bp, url_prefix="/api/foods")

    with app.app_context():
        from .models import User, Food, Recipe, Ingredient, MealPlan, MealPlanEntry, ShoppingItem
        db.create_all()

    return app