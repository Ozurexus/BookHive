import logging
from io import BytesIO
from typing import List

import requests

from models import BookExt, Book
from PIL import Image
from urllib.request import Request, urlopen
import urllib
from config import Config


class GoogleApiService:
    def __init__(self, conf: Config):
        self.api_key = conf.BackendConfig.api_google_key
        self.timeout = conf.BackendConfig.api_request_timeout

    def get_annot_genre_image(self, isbn) -> tuple[str, str, str]:
        logging.debug("take_annotation_and_genre")
        base_url = "https://www.googleapis.com/books/v1"
        search_url = f"{base_url}/volumes?q=isbn:{isbn}&key={self.api_key}"
        try:
            response = requests.get(search_url, timeout=self.timeout)
            response.raise_for_status()
        except Exception as e:
            logging.error(e)
            return "", "", ""

        try:
            book = response.json()["items"][0]
        except Exception as e:
            logging.error(e)
            return "", "", ""

        try:
            annotation = book["volumeInfo"]["description"]
        except Exception:
            annotation = ""

        # genre
        try:
            genre = book["volumeInfo"]["categories"][0]
            genre = genre.split(" / ")[0]
        except Exception:
            genre = ""

        # image_link
        try:
            image_link = book["volumeInfo"]["imageLinks"]["thumbnail"]
        except Exception as e:
            image_link = ""

        return annotation, genre, image_link


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


def get_image_height_width(image_url: str, timeout: float) -> (int, int):
    req = Request(image_url)
    req.add_header("user-agent",
                   "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36")

    try:
        fp = urlopen(req, timeout=timeout)
        mybytes = fp.read()
        im = Image.open(BytesIO(mybytes))
        fp.close()
        return im.size
    except Exception as e:
        logging.error(e)
        return 1, 1


def is_image_blank(image_url: str, timeout: float) -> bool:
    h, w = get_image_height_width(image_url, timeout)
    return h == 1 and w == 1


def generate_image_url(config: Config, image_name: str) -> str:
    image_url = config.BackendConfig.public_addr + f"/static/{image_name}"
    return image_url


def from_db_book_to_model(book) -> BookExt:
    book_model: BookExt = BookExt(
        id=int(book[0]),
        isbn=book[1],
        title=book[2],
        author=book[3],
        year_of_publication=int(book[4]),
        publisher=book[5],
        image_url_s=book[6],
        image_url_m=book[7],
        image_url_l=book[8],
        genre=book[9],
        annotation=book[10],
        rating=None,
        want_to_read=None,
    )
    if len(book) >= 12:
        book_model.rating = book[11]
    return book_model
