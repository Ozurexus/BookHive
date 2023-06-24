import logging
from typing import List

import psycopg2
import requests

from config import Postgres
from models import *


class ConstraintError(Exception):
    pass


class UserAlreadyExists(Exception):
    pass


class UserNotFound(Exception):
    pass


class DB:
    def __init__(self, conf: Postgres):
        logging.info("connecting to postgres...")
        self.conn = psycopg2.connect(
            dbname=conf.database,
            user=conf.user,
            password=conf.password,
            host=conf.host,
            port=int(conf.port),
        )
        self.cur = self.conn.cursor()
        logging.info("connected!")

    def update_annotation_and_genre(self, book_id, annotation, genre):
        update_query = f"""UPDATE books
                        SET annotation = %s, genre = %s
                        WHERE id = %s"""
        self.cur.execute(update_query, (annotation, genre, book_id))
        self.conn.commit()
        logging.debug("annotation and genre updated!")

    def get_user_recommended_books(self, user_id) -> List[Book]:
        select_query = f"""
            SELECT b.id, isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l, genre, annotation
            FROM books b
                     JOIN ratings r ON b.id = r.book_id
            WHERE r.user_id = %s
        """
        books: List[Book] = []
        self.cur.execute(select_query, (user_id,))
        for book in self.cur.fetchall():
            book_model: Book = Book(
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
            )

            if book_model.genre == "" and book_model.annotation == "":
                annotation, genre = fetch_annotation_and_genre(book_model.isbn)
                book_model.annotation = annotation
                book_model.genre = genre
                self.update_annotation_and_genre(book_model.id, annotation, genre)
            books.append(book_model)
        return books

    def find_books_by_title_pattern(
            self, pattern: str, limit: int = 0
    ) -> List[BooksByPatternItem]:
        query = """SELECT id, title, author, image_url_s 
        FROM books WHERE LOWER(title) LIKE (%s)
        """
        pattern = pattern + "%"
        if limit > 0:
            query += " LIMIT %s"
            self.cur.execute(query, (pattern, limit))
        else:
            self.cur.execute(query, (pattern,))

        dst = []
        for item in self.cur.fetchall():
            dst.append(
                BooksByPatternItem(
                    book_id=item[0],
                    title=item[1],
                    author=item[2],
                    image_link_small=item[3],
                )
            )
        return dst

    def rate_book(self, rate_req: RateReq):
        query = """INSERT INTO ratings (user_id, book_id, rating) 
                    VALUES (%s, %s, %s) """
        try:
            self.cur.execute(query, (rate_req.user_id, rate_req.book_id, rate_req.rate))
            self.conn.commit()
        except psycopg2.errors.ForeignKeyViolation:
            raise ConstraintError

    def get_books_ids_by_user(self, user_id: int):
        query = f"""SELECT book_id 
                        FROM ratings 
                        WHERE user_id = %s"""
        self.cur.execute(query, (user_id,))
        data = self.cur.fetchall()
        books_ids = []
        for book_id in data:
            books_ids.append(book_id[0])

        return books_ids

    def register_user(self, user: UserRegisterReq, pass_hash: str) -> User:
        query = """SELECT * FROM users WHERE login=%s AND password_hash=%s"""
        self.cur.execute(query, (user.login, pass_hash))
        if len(self.cur.fetchall()):
            raise UserAlreadyExists

        query = """insert INTO users (id, login, password_hash)
            SELECT MAX(id) + 1, %s, %s FROM users
            RETURNING id, login, password_hash"""
        self.cur.execute(query, (user.login, pass_hash))
        self.conn.commit()

        data = self.cur.fetchall()[0]

        user_id = int(data[0])
        login = str(data[1])
        password_hash = str(data[2])

        return User(id=user_id, login=login, password_hash=password_hash)

    def login_user(self, user: UserLoginReq, pass_hash: str) -> User:
        query = """SELECT * FROM users WHERE login=%s AND password_hash=%s"""
        self.cur.execute(query, (user.login, pass_hash))
        dst = self.cur.fetchall()
        if not len(dst):
            raise UserNotFound

        data = dst[0]
        user_id = int(data[0])
        login = str(data[1])
        password_hash = str(data[2])
        return User(id=user_id, login=login, password_hash=password_hash)


def fetch_annotation_and_genre(isbn):
    logging.debug("take_annotation_and_genre")
    base_url = "https://www.googleapis.com/books/v1"
    search_url = f"{base_url}/volumes?q=isbn:{isbn}"
    response = requests.get(search_url)
    response.raise_for_status()
    result = response.json()["items"][0]
    book_id = result["id"]
    book_url = f"{base_url}/volumes/{book_id}"
    response = requests.get(book_url)
    response.raise_for_status()
    book = response.json()
    try:
        annotation = book["volumeInfo"]["description"]
    except Exception as e:
        try:
            annotation = book["description"]
        except Exception as e:
            annotation = ""
    try:
        genre = book["volumeInfo"]["categories"][0]
    except Exception as e:
        try:
            genre = book["categories"][0]
        except Exception as e:
            genre = ""
    return annotation, genre
