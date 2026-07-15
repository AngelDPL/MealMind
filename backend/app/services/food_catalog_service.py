from sqlalchemy import or_
from app.models import Food

BASE_CATEGORIES_LIMIT = 60
PREFERRED_MATCH_LIMIT = 40


def get_filtered_catalog(preferred_ingredients, lang="en"):
    """
    Devuelve una lista acotada de Food relevante para el prompt:
    - Coincidencias de texto con los ingredientes preferidos del usuario
    - Complementado con una selección general de otras categorías, para variedad
    """
    matched = []
    if preferred_ingredients:
        conditions = []
        for term in preferred_ingredients:
            like_term = f"%{term}%"
            conditions.append(Food.name.ilike(like_term))
            conditions.append(Food.name_en.ilike(like_term))
        matched = Food.query.filter(or_(*conditions)).limit(PREFERRED_MATCH_LIMIT).all()

    matched_ids = {f.id for f in matched}

    remaining_slots = BASE_CATEGORIES_LIMIT
    base_foods = (
        Food.query.filter(~Food.id.in_(matched_ids))
        .order_by(Food.category)
        .limit(remaining_slots)
        .all()
    )

    combined = matched + base_foods

    return [
        {
            "id": f.id,
            "name": f.name_en if lang == "en" and f.name_en else f.name,
            "category": f.category_en if lang == "en" and f.category_en else f.category,
            "unit": f.unit,
        }
        for f in combined
    ]