import logging
from io import BytesIO
from typing import List

import requests

from models import BookExt, Book
from PIL import Image
from urllib.request import Request, urlopen
import urllib
from config import Config


def fetch_annotation_and_genre(isbn):
    logging.debug("take_annotation_and_genre")
    base_url = "https://www.googleapis.com/books/v1"
    search_url = f"{base_url}/volumes?q=isbn:{isbn}"
    try:
        response = requests.get(search_url, timeout=0.5)
        response.raise_for_status()
    except Exception as e:
        logging.error(e)
        return "", ""

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


def from_books_ext_to_books(books_ext: List[BookExt]) -> List[Book]:
    return [Book(**book_ext.dict()) for book_ext in books_ext]


def get_image_height_width(image_url: str) -> (int, int):
    req = Request(image_url)
    req.add_header("user-agent",
                   "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36")

    try:
        fp = urlopen(req, timeout=0.5)
        mybytes = fp.read()
        im = Image.open(BytesIO(mybytes))
        fp.close()
        return im.size
    except Exception as e:
        logging.error(e)
        return 1, 1


def is_image_blank(image_url: str) -> bool:
    h, w = get_image_height_width(image_url)
    return h == 1 and w == 1


def generate_image_url(config: Config, image_name: str) -> str:
    image_url = config.BackendConfig.public_addr + f"/static/{image_name}"
    return image_url
