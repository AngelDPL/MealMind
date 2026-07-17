from app import create_app
from app.services.unsplash_service import get_recipe_image
from app.data.starter_recipes import STARTER_RECIPES

app = create_app()

with app.app_context():
    for r in STARTER_RECIPES:
        data = get_recipe_image(r["name"])
        if data:
            print(f'    "{r["name"]}": {{"url": "{data["url"]}", "photographer_name": "{data["photographer_name"]}", "photographer_url": "{data["photographer_url"]}"}},')
        else:
            print(f'    "{r["name"]}": None,')