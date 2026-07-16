from app import create_app
from app.services.unsplash_service import get_recipe_image
from app.data.starter_recipes import STARTER_RECIPES

app = create_app()

with app.app_context():
    for r in STARTER_RECIPES:
        url = get_recipe_image(r["name"])
        print(f'    "{r["name"]}": "{url}",')