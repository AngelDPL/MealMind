from app import create_app
from app.extensions import db
from app.models.recipe import Recipe
from app.services.unsplash_service import get_recipe_image, trigger_unsplash_download

app = create_app()


def backfill_images():
    with app.app_context():
        recipes = db.session.execute(
            db.select(Recipe).where(Recipe.image_url.is_(None))
        ).scalars().all()

        print(f"{len(recipes)} recipes without image found.")

        for i, recipe in enumerate(recipes, start=1):
            image_data = get_recipe_image(recipe.name)
            if image_data:
                recipe.image_url = image_data["url"]
                recipe.image_photographer_name = image_data["photographer_name"]
                recipe.image_photographer_url = image_data["photographer_url"]
                db.session.commit()
                trigger_unsplash_download(image_data["download_location"])
                print(f"[{i}/{len(recipes)}] {recipe.name} -> image set")
            else:
                print(f"[{i}/{len(recipes)}] {recipe.name} -> no image found")


if __name__ == "__main__":
    backfill_images()