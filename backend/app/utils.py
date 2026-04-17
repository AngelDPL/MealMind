from app.extensions import db
from app.models.recipe import Recipe, Ingredient
from app.models.food import Food
from app.data.starter_recipes import STARTER_RECIPES

def create_starter_recipes(user_id):
    for r in STARTER_RECIPES:
        recipe = Recipe(
            name=r['name'],
            name_es=r.get('name_es'),
            description=r['description'],
            user_id=user_id
        )
        db.session.add(recipe)
        db.session.flush()

        for food_name, quantity in r['ingredients']:
            food = db.session.execute(
                db.select(Food).where(Food.name == food_name)
            ).scalar_one_or_none()
            if not food:
                continue
            ingredient = Ingredient(
                food_id=food.id,
                quantity=quantity,
                recipe_id=recipe.id
            )
            db.session.add(ingredient)

    db.session.commit()