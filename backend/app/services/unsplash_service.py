import os
import requests

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
UNSPLASH_URL = "https://api.unsplash.com/search/photos"


def get_recipe_image(query):
    if not UNSPLASH_ACCESS_KEY:
        return None
    try:
        response = requests.get(
            UNSPLASH_URL,
            params={"query": f"{query} food dish", "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=5,
        )
        response.raise_for_status()
        results = response.json().get("results", [])
        if results:
            return results[0]["urls"]["regular"]
    except Exception as e:
        print(f"[UNSPLASH ERROR] {e}")
    return None