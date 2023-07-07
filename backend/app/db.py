import logging
import queue
import threading
import time
from asyncio import threads

import psycopg2

from util import *
from config import Config
from models import *
from mocks import *


class ConstraintError(Exception):
    pass


class UserAlreadyExists(Exception):
    pass


class NotFound(Exception):
    pass


class DB:
    def __init__(self, conf: Config):
        pg_conf = conf.PostgresConfig
        logging.info("connecting to postgres...")
        self.conn = psycopg2.connect(
            dbname=pg_conf.database,
            user=pg_conf.user,
            password=pg_conf.password,
            host=pg_conf.host,
            port=int(pg_conf.port),
        )
        self.conf = conf
        self.cur = self.conn.cursor()

        # cache
        self.books_images_checked = set()
        self.books_genre_checked = set()
        logging.info("connected!")

    def map_user_book_wishes(self, books: List[BookExt], user_id: int) -> List[BookExt]:
        query = """SELECT book_id FROM books_wishes WHERE user_id=%s"""
        self.cur.execute(query, (user_id,))
        dst = self.cur.fetchall()

        books_ids = set()
        for book_id in dst:
            books_ids.add(book_id[0])

        # mapping
        for book in books:
            book.want_to_read = book.id in books_ids

        return books

    def rollback(self):
        self.conn.rollback()

    def map_ratings_book(self, books: List[BookExt], user_id: int) -> List[BookExt]:
        query = """SELECT rating, book_id FROM ratings WHERE user_id=%s"""
        self.cur.execute(query, (user_id,))
        dst = self.cur.fetchall()

        for r in dst:
            rating = r[0]
            book_id = r[1]
            for book in books:
                if book.id == book_id:
                    book.rating = rating
        return books

    def update_images(self, book: BookExt):
        logging.info(f'updating image urls... {book.id}')
        query = "UPDATE books SET image_url_s=%s, image_url_m=%s, image_url_l=%s WHERE id=%s"
        self.cur.execute(query, (book.image_url_s, book.image_url_m, book.image_url_l, book.id))
        self.conn.commit()

    def handle_images(self, book: BookExt):
        if book.id in self.books_images_checked:
            return
        need_update = False

        addr = self.conf.BackendConfig.public_addr
        if not book.image_url_s.startswith(addr) and is_image_blank(book.image_url_s):
            book.image_url_s = generate_image_url(self.conf, "emptyCoverS.png")
            need_update = True

        if not book.image_url_m.startswith(addr) and is_image_blank(book.image_url_m):
            book.image_url_m = generate_image_url(self.conf, "emptyCoverM.png")
            need_update = True

        if not book.image_url_l.startswith(addr) and is_image_blank(book.image_url_l):
            book.image_url_l = generate_image_url(self.conf, "emptyCoverL.png")
            need_update = True

        if need_update:
            self.update_images(book)
        self.books_images_checked.add(book.id)

    def handle_genre_annotation(self, book: BookExt):
        if book.id in self.books_genre_checked:
            return
        if book.genre == "" and book.annotation == "":
            annotation, genre = fetch_annotation_and_genre(book.isbn)
            if annotation == "":
                annotation = get_default_annotation()

            if genre == "":
                genre = get_default_genre()

            book.annotation = annotation
            book.genre = genre
            self.update_annotation_and_genre(book.id, annotation, genre)
        self.books_genre_checked.add(book.id)

    def parse_books_ext_from_db(self, fetchall, user_id: int, need_ratings=False) -> List[BookExt]:
        lock = threading.Lock()
        books: List[BookExt] = []

        def run(b: BookExt):
            self.handle_genre_annotation(b)
            self.handle_images(b)
            with lock:
                books.append(b)

        threads_list = []
        for book in fetchall:
            book_model: BookExt = from_db_book_to_model(book)
            t = threading.Thread(target=run, args=(book_model,))
            threads_list.append(t)
            t.start()

        for t in threads_list:
            t.join()

        if need_ratings:
            books = self.map_ratings_book(books, user_id)
        return self.map_user_book_wishes(books, user_id)

    def update_annotation_and_genre(self, book_id, annotation, genre):
        update_query = """UPDATE books
                        SET annotation = %s, genre = %s
                        WHERE id = %s"""
        self.cur.execute(update_query, (annotation, genre, book_id))
        self.conn.commit()
        logging.debug("annotation and genre updated!")

    def get_user_recommended_books(self, user_id) -> List[BookExt]:
        select_query = """
            SELECT b.id, isbn, title, author, year_of_publication, publisher, image_url_s, 
                    image_url_m, image_url_l, genre, annotation, r.rating
            FROM books b
                     JOIN ratings r ON b.id = r.book_id
            WHERE r.user_id = %s
        """
        self.cur.execute(select_query, (user_id,))
        return self.parse_books_ext_from_db(self.cur.fetchall(), user_id)

    def find_books_by_title_pattern(self, pattern: str, limit: int = 0, by_author: bool = False) -> List[BooksByPatternItem]:
        query = """SELECT id, title, author, image_url_s, image_url_m, image_url_l
        FROM books WHERE LOWER(title) LIKE (%s)
        """
        if by_author:
            query = query.replace("LOWER(title)", "LOWER(author)")
        pattern = pattern + "%"
        if limit > 0:
            query += " LIMIT %s"
            self.cur.execute(query, (pattern, limit))
        else:
            self.cur.execute(query, (pattern,))

        def run(b):
            self.handle_images(b)

        books = []
        for item in self.cur.fetchall():
            books.append(
                BooksByPatternItem(
                    id=item[0],
                    title=item[1],
                    author=item[2],
                    image_url_s=item[3],
                    image_url_m=item[4],
                    image_url_l=item[5]
                )
            )

        threads_list = []
        for book in books:
            t = threading.Thread(target=run, args=(book,))
            threads_list.append(t)
            t.start()

        for t in threads_list:
            t.join()

        return books

    def rate_book(self, rate_req: RateReq):
        # checking whether already exists
        check_query = """SELECT 1 FROM ratings WHERE user_id = %s AND book_id = %s"""
        self.cur.execute(check_query, (rate_req.user_id, rate_req.book_id))
        if len(self.cur.fetchall()) > 0:
            update_query = (
                """UPDATE ratings SET rating=%s WHERE user_id=%s AND book_id=%s"""
            )
            self.cur.execute(
                update_query, (rate_req.rate, rate_req.user_id, rate_req.book_id)
            )
            self.conn.commit()
            return

        # if no just insert
        query = """INSERT INTO ratings (user_id, book_id, rating) 
                    VALUES (%s, %s, %s) """
        try:
            self.cur.execute(query, (rate_req.user_id, rate_req.book_id, rate_req.rate))
            self.conn.commit()
        except psycopg2.errors.ForeignKeyViolation:
            raise ConstraintError

        # handling book
        self.cur.execute("""SELECT * FROM books WHERE id=%s""", (rate_req.book_id,))
        book = self.cur.fetchall()
        if len(book):
            book = book[0]
            book_obj: Book = Book(id=int(book[0]),
                                  isbn=book[1],
                                  title=book[2],
                                  author=book[3],
                                  year_of_publication=int(book[4]),
                                  publisher=book[5],
                                  image_url_s=book[6],
                                  image_url_m=book[7],
                                  image_url_l=book[8],
                                  genre=book[9],
                                  annotation=book[10])
            self.handle_images(book_obj)
            self.handle_genre_annotation(book_obj)
            logging.info("handled genre,annotation,images")

    def un_rate_book(self, rate_req: UnRateReq):
        # checking whether already exists
        check_query = """SELECT 1 FROM ratings WHERE user_id = %s AND book_id = %s"""
        self.cur.execute(check_query, (rate_req.user_id, rate_req.book_id))
        if len(self.cur.fetchall()) == 0:
            return

        # if no just insert
        query = """DELETE FROM ratings WHERE user_id=%s, book_id=%s"""
        try:
            self.cur.execute(query, (rate_req.user_id, rate_req.book_id))
            self.conn.commit()
        except psycopg2.errors.ForeignKeyViolation:
            raise ConstraintError

    def register_user(self, user: UserRegisterReq, pass_hash: str) -> User:
        query = """SELECT * FROM users WHERE login=%s"""
        self.cur.execute(query, (user.login,))
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
            raise NotFound

        data = dst[0]
        user_id = int(data[0])
        login = str(data[1])
        password_hash = str(data[2])
        return User(id=user_id, login=login, password_hash=password_hash)

    def change_password(self, user_id: int, old_password: str, new_password: str):
        query = """SELECT 1 FROM users WHERE password_hash=%s AND id=%s"""
        self.cur.execute(query, (old_password, user_id))
        dst = self.cur.fetchall()
        if not len(dst):
            raise NotFound

        query_update = """UPDATE users SET password_hash=%s WHERE id=%s"""
        self.cur.execute(query_update, (new_password, user_id))
        self.conn.commit()

    def wish_unwish_book(self, req: WantToReadBookReq):
        # checking whether already exists
        check_query = (
            """SELECT 1 FROM books_wishes WHERE user_id = %s AND book_id = %s"""
        )
        self.cur.execute(check_query, (req.user_id, req.book_id))
        if len(self.cur.fetchall()) > 0:
            delete_query = (
                """DELETE FROM books_wishes WHERE user_id=%s AND book_id=%s"""
            )
            self.cur.execute(delete_query, (req.user_id, req.book_id))
            self.conn.commit()
            return

        try:
            query = """INSERT INTO books_wishes (user_id, book_id) VALUES (%s, %s)"""
            self.cur.execute(query, (req.user_id, req.book_id))
            self.conn.commit()
        except psycopg2.errors.ForeignKeyViolation:
            raise ConstraintError

    def get_user_favorite_books(self, user_id) -> List[Book]:
        query = """SELECT b.id,
                       b.isbn,
                       b.title,
                       b.author,
                       b.year_of_publication,
                       b.publisher,
                       b.image_url_s,
                       b.image_url_m,
                       b.image_url_l,
                       b.genre,
                       b.annotation
                FROM books_wishes fb
                         JOIN books b on b.id = fb.book_id
                WHERE fb.user_id = %s"""

        self.cur.execute(query, (user_id,))
        return self.parse_books_ext_from_db(
            self.cur.fetchall(), user_id, need_ratings=True
        )

    def get_books_by_ids(self, book_ids: list, user_id: int) -> List[Book]:
        select_query = """
                    SELECT b.id, isbn, title, author, year_of_publication, publisher, image_url_s, 
                            image_url_m, image_url_l, genre, annotation
                    FROM books b WHERE b.id IN %s
                """
        book_ids = tuple(book_ids)
        self.cur.execute(select_query, (book_ids,))
        dst = from_books_ext_to_books(self.parse_books_ext_from_db(self.cur.fetchall(), user_id))
        return dst

    def get_user_reviewed_books_num(self, user_id) -> int:
        query = """SELECT COUNT(*) FROM ratings WHERE user_id = %s"""
        self.cur.execute(query, (user_id,))

        dst = self.cur.fetchall()
        return dst[0][0]
