import os
import requests

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos"


def get_recipe_image(query):
    if not UNSPLASH_ACCESS_KEY:
        return None
    try:
        response = requests.get(
            UNSPLASH_SEARCH_URL,
            params={"query": f"{query} food dish", "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=5,
        )
        response.raise_for_status()
        results = response.json().get("results", [])
        if results:
            photo = results[0]
            return {
                "url": photo["urls"]["regular"],
                "download_location": photo["links"]["download_location"],
                "photographer_name": photo["user"]["name"],
                "photographer_url": photo["user"]["links"]["html"],
            }
    except Exception as e:
        print(f"[UNSPLASH ERROR] {e}")
    return None


def trigger_unsplash_download(download_location):
    if not UNSPLASH_ACCESS_KEY or not download_location:
        return
    try:
        requests.get(
            download_location,
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=5,
        )
    except Exception as e:
        print(f"[UNSPLASH DOWNLOAD TRIGGER ERROR] {e}")