import logging
import requests


def fetch_annotation_and_genre(isbn):
    logging.debug("take_annotation_and_genre")
    base_url = "https://www.googleapis.com/books/v1"
    search_url = f"{base_url}/volumes?q=isbn:{isbn}"
    response = requests.get(search_url)
    response.raise_for_status()

    try:
        book = response.json()["items"][0]
    except Exception:
        return "", ""

    try:
        annotation = book["volumeInfo"]["description"]
    except Exception:
        annotation = ""

    try:
        genre = book["volumeInfo"]["categories"][0]
        genre = genre.split(" / ")[0]
    except Exception:
        genre = ""
    return annotation, genre


# - 0-10 books read: Newbie Reader
# - 11-25 books read: Intermediate Reader
# - 26-50 books read: Advanced Reader
# - 51-75 books read: Expert Reader
# - 76-100 books read: Master Reader
# - 100+ books read: Elite Reader or Reading Champion

USER_STATUSES = ["Newbie", "Intermediate", "Advanced", "Expert", "Master", "Champion"]


def calculate_user_status(reviewed_books: int):
    if 0 <= reviewed_books <= 10:
        return USER_STATUSES[0]
    elif 11 <= reviewed_books <= 25:
        return USER_STATUSES[1]
    elif 26 <= reviewed_books <= 50:
        return USER_STATUSES[2]
    elif 51 <= reviewed_books <= 75:
        return USER_STATUSES[3]
    elif 76 <= reviewed_books <= 100:
        return USER_STATUSES[4]
    return USER_STATUSES[5]
