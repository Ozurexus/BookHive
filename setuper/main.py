import json

import csv
import psycopg2

SERVICE = "setuper"
MIGRATION_FILE = "./migrations/migration_default.sql"
CONFIG_PATH = "config.json"

# config

config_file = open(CONFIG_PATH, "r")
config: dict = json.loads(config_file.read())

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


def dump_from_csv():
    # books
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
            print("books table import...", end=" ")
            cur.execute(insert_query)
            conn.commit()
        except psycopg2.errors.UniqueViolation as e:
            conn.rollback()
            print("⚠️  seems data is already imported - rollback")
        else:
            print(" ✅")

    # users
    users = [(i, f"login_{i}", f"password_{i}") for i in range(1, 278859)]
    records_list_template = ",".join(["%s"] * len(users[0]))
    args = ",".join(
        cur.mogrify(f"({records_list_template})", i).decode("utf-8") for i in users
    )
    insert_query = f"INSERT INTO users (id, login, password_hash) " f"VALUES {args}"
    try:
        print("users table import...", end=" ")
        cur.execute(insert_query)
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        print("⚠️  seems data is already imported - rollback")
    else:
        print(" ✅")

    books_file = "./csv/ratings_cut.csv"
    with open(books_file, "r") as file:
        reader = csv.reader(file, delimiter=",", quotechar='"')
        ratings = [row[1:] for row in reader][1:]

        """Из-за того что кое кто дал кривые данные нужны костыли"""
        for rate in ratings:
            rate[0] = int(rate[0]) + 1
            rate[2] = int(rate[2]) + 1

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
            print("ratings table import...", end=" ")
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
