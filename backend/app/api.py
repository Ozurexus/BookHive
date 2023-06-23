from fastapi import FastAPI
from time import sleep
# from ml.aml import get_recs
from db import DB
from config import get_config

app = FastAPI()
config = get_config()
db = DB(config.PostgresConfig)


@app.get('/ping')
def ping():
    return {'answer': 'pong'}


@app.get("/get_rated_books/{user_id}")
def get_rated_books(user_id):
    # getting book_ids
    select_query = f"""SELECT book_id 
                    FROM ratings 
                    WHERE user_id = %s"""
    db.cur.execute(select_query, (user_id, ))
    data = db.cur.fetchall()
    books_ids = []
    for book_id in data:
        books_ids.append(book_id[0])

    # getting books info
    books_info = []
    for book_id in books_ids:
        book_info = db.get_book_info(book_id)
        books_info.append(book_info)
        sleep(1)  # ??
    books = {'items': books_info, 'size': len(books_info)}
    return books


@app.get("/get_recommended_books/{user_id}_{number_of_books}")
def get_recommendations(user_id, number_of_books):
    recommendations = get_recs(user_id, number_of_books)
    books_info = []
    for rec in recommendations:
        book_info = db.get_book_info(rec)
        books_info.append(book_info)
        sleep(1)  # ???
    books = {'books': books_info}
    return books


def search_book(request):
    # search books in database
    # return books
    pass
