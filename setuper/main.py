import hashlib
import json

import csv
import psycopg2
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SERVICE = "setuper"
MIGRATION_FILE = "./migrations/migration_default.sql"
CONFIG_PATH = "config.json"

# config

config_file = open(CONFIG_PATH, "r")
config: dict = json.loads(config_file.read())

salt = config['backend']['password_salt']
db_name = config["postgres"]["database"]
user = config["postgres"]["user"]
password = config["postgres"]["password"]
host = config["postgres"]["host"]
port = config["postgres"]["port"]

print("connecting to postgres...")
conn = psycopg2.connect(
    dbname=db_name, user=user, password=password, host=host, port=int(port)
)
cur = conn.cursor()


def migrate():
    print("making migrations...", end="")
    migrations = open(MIGRATION_FILE, "r").read()
    print(migrations)
    cur.execute(migrations)
    conn.commit()

    print(" ✅")

def get_password_hash(password: str):
    salted_password = password + salt
    salted_password_bytes = salted_password.encode("utf-8")
    hashed_password = hashlib.sha256(salted_password_bytes).hexdigest()

    return str(hashed_password)

def dump_from_csv():
    # books
    cur.execute("SELECT id FROM books")
    print("books table import...", end=" ")
    cnt = len(cur.fetchall())
    if cnt:
        print(f"⚠️  seems data is already imported - skipping ({cnt} found)")
    else:
        books_file = "./csv/books_cut.csv"
        with open(books_file, "r") as file:
            reader = csv.reader(file, delimiter=",", quotechar='"')
            books = [row + ["", ""] for row in reader][1:]
            for book in books:
                try:
                    book[0] = int(book[0]) + 1
                    book[4] = int(book[4])
                    if len(book) != 11:
                        print(book)
                except Exception as e:
                    print(book)
                    print(e)
            books = [tuple(book) for book in books]
            records_list_template = ",".join(["%s"] * 11)
            args = ",".join(
                cur.mogrify(f"({records_list_template})", i).decode("utf-8") for i in books
            )

            insert_query = f"INSERT INTO books (id, isbn, title, author, year_of_publication, " + \
                f"publisher, image_url_s, image_url_m, image_url_l, genre, annotation) " + \
                f"VALUES {args}"

            try:
                cur.execute(insert_query)
                conn.commit()
            except psycopg2.errors.UniqueViolation as e:
                conn.rollback()
                print("⚠️  seems data is already imported - rollback")
            else:
                print(" ✅")

    # users
    cur.execute("SELECT id FROM users")
    cnt = len(cur.fetchall())
    print("users table import...", end=" ")
    if cnt:
        print(f"⚠️  seems data is already imported - skipping ({cnt} found)")
    else:
        # users with default admin user
        users = [(i, f"login_{i}", get_password_hash(f"password_{i}")) for i in range(1, 4229)]
        users.append((len(users) + 1, 'admin', get_password_hash('admin')))

        records_list_template = ",".join(["%s"] * len(users[0]))
        args = ",".join(
            cur.mogrify(f"({records_list_template})", i).decode("utf-8") for i in users
        )
        insert_query = f"INSERT INTO users (id, login, password_hash) " f"VALUES {args}"
        try:
            cur.execute(insert_query)
            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            print("⚠️  seems data is already imported - rollback")
        else:
            print(" ✅")

    print("ratings table import...", end=" ")
    cur.execute("SELECT id FROM ratings")
    cnt = len(cur.fetchall())
    if cnt:
        print(f"⚠️  seems data is already imported - skipping ({cnt} found)")
    else:
        ratings_file = "./csv/ratings_cut.csv"
        with open(ratings_file, "r") as file:
            reader = csv.reader(file, delimiter=",", quotechar='"')
            ratings = [row[1:] for row in reader][1:]

            """Из-за того что кое кто дал кривые данные нужны костыли"""
            for rate in ratings:
                rate[0] = int(rate[0]) + 1
                if rate[2] == '':
                    rate[2] = 1
                rate[2] = int(float(rate[2])) + 1

            ratings = [tuple(int(r) for r in rate) for rate in ratings]

            records_list_template = ",".join(["%s"] * len(ratings[0]))
            args = ",".join(
                cur.mogrify(f"({records_list_template})", i).decode("utf-8")
                for i in ratings
            )
            insert_query = (
                f"INSERT INTO ratings (user_id, rating, book_id) " f"VALUES {args}"
            )
            try:
                cur.execute(insert_query)
                conn.commit()
            except psycopg2.errors.UniqueViolation:
                print("⚠️  seems data is already imported - rollback")
                conn.rollback()
            else:
                print(" ✅")


if __name__ == "__main__":
    print("starting")
    migrate()
    dump_from_csv()
    print(" ✅")
