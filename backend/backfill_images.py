import time
from app import create_app
from app.extensions import db
from app.models.recipe import Recipe
from app.services.unsplash_service import get_recipe_image

app = create_app()


def backfill_images():
    with app.app_context():
        recipes = db.session.execute(
            db.select(Recipe).where(Recipe.image_url.is_(None))
        ).scalars().all()

        print(f"{len(recipes)} recipes without image found.")

        for i, recipe in enumerate(recipes, start=1):
            image_url = None
            for attempt in range(3):
                image_url = get_recipe_image(recipe.name)
                if image_url:
                    break
                time.sleep(2)

            if image_url:
                recipe.image_url = image_url
                db.session.commit()
                print(f"[{i}/{len(recipes)}] {recipe.name} -> image set")
            else:
                print(f"[{i}/{len(recipes)}] {recipe.name} -> no image found after retries")

            time.sleep(0.5)


if __name__ == "__main__":
    backfill_images()