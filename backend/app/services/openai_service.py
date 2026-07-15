import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "gpt-4o-mini"

MEALS = ["breakfast", "lunch", "dinner"]

LANGUAGE_NAMES = {
    "es": "Spanish",
    "en": "English",
}


def build_prompt(days, max_calories_per_meal, catalog, allergies, dietary_style, lang):
    allergies_text = ", ".join(allergies) if allergies else "none"
    style_text = dietary_style if dietary_style else "no specific style"
    language_name = LANGUAGE_NAMES.get(lang, "English")
    days_text = ", ".join(days)

    catalog_text = "\n".join(
        f'- id={f["id"]}: {f["name"]} ({f["category"]}, unit: {f["unit"]})'
        for f in catalog
    )

    return f"""You are a meal planning assistant. Generate a meal plan (breakfast, lunch, dinner) for the following days only: {days_text}.

You MUST build every meal using ONLY the ingredients listed in the catalog below, referencing them by their exact "id". Do not invent ingredients or ids that are not in this list. If a common ingredient is missing from the catalog, choose the closest available substitute from the list instead.

CATALOG (id: name (category, unit)):
{catalog_text}

Constraints:
- Maximum {max_calories_per_meal} calories per meal (you do not need to calculate exact calories, just choose reasonable quantities)
- Dietary style: {style_text}
- STRICT ALLERGY EXCLUSIONS (never include these ingredients or derivatives, under any circumstance): {allergies_text}

IMPORTANT: Write the meal "name" in {language_name}. Keep JSON keys and the "day"/"type" values exactly as specified in the schema below (always in English).

Respond ONLY with valid JSON, no markdown, no extra text, using exactly this schema:
    {{
        "days": [
            {{
            "day": "...",
            "meals": [
                    {{
                    "type": "breakfast",
                    "name": "...",
                    "ingredients": [
                        {{"food_id": 0, "quantity": 0}}
                    ]
                    }},
                    {{"type": "lunch", "name": "...", "ingredients": [{{"food_id": 0, "quantity": 0}}]}},
                    {{"type": "dinner", "name": "...", "ingredients": [{{"food_id": 0, "quantity": 0}}]}}
                ]
            }}
        ]
    }}

"quantity" is the amount in the ingredient's unit (usually grams). Use realistic portion sizes.
The "days" array must contain exactly these days in this order: {days_text}.
Each day must contain exactly these 3 meal types in order: {", ".join(MEALS)}.
"""


def generate_meal_plan(days, max_calories_per_meal, catalog, allergies, dietary_style=None, lang="en"):
    prompt = build_prompt(days, max_calories_per_meal, catalog, allergies, dietary_style, lang)

    response = client.chat.completions.create(
        model=MODEL,
        max_tokens=3000,
        temperature=0.7,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a precise JSON API. You only output valid JSON matching the requested schema, using only ingredient ids from the provided catalog."},
            {"role": "user", "content": prompt},
        ],
    )

    raw_text = response.choices[0].message.content
    return json.loads(raw_text)