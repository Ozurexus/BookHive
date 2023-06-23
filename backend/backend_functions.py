import json
import psycopg2
from fastapi import FastAPI
import requests
from time import sleep
from ml.aml import get_recs

CONFIG_PATH = "config.json"
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
print('connected!')

app = FastAPI()


# function updates annotation and genre of book in database
def update_annotation_and_genre(book_id, annotation, genre):
    update_query = f"""UPDATE books
                    SET annotation = '{annotation}', genre = '{genre}'
                    WHERE id = {book_id}"""
    cur.execute(update_query)
    conn.commit()
    print('annotation and genre updated!')


# function takes annotation and genre of book by its isbn
def take_annotation_and_genre(isbn):
    base_url = "https://www.googleapis.com/books/v1"
    search_url = f"{base_url}/volumes?q=isbn:{isbn}"
    response = requests.get(search_url)
    response.raise_for_status()
    result = response.json()['items'][0]
    book_id = result['id']
    book_url = f"{base_url}/volumes/{book_id}"
    response = requests.get(book_url)
    response.raise_for_status()
    book = response.json()
    try:
        annotation = book['volumeInfo']['description']
    except Exception as e:
        try:
            annotation = book['description']
        except Exception as e:
            annotation = ''
    try:
        genre = book['volumeInfo']['categories'][0]
    except Exception as e:
        try:
            genre = book['categories'][0]
        except Exception as e:
            genre = ''
    return annotation, genre

# function takes book info from database and uploads if got new info from google API
def get_book_info(book_id):
    select_query = f"""SELECT * 
                    FROM books 
                    WHERE id = {book_id};"""
    cur.execute(select_query)
    data = cur.fetchone()
    conn.commit()
    book_info = {'isbn': data[1], 'title': data[2], 'author': data[3], 'year_of_publication': data[4],
                 'publisher': data[5], 'image_url_s': data[6], 'image_url_m': data[7], 'image_url_l': data[8],
                 'genre': data[9], 'annotation': data[10]}
    if book_info['genre'] == '' or book_info['annotation'] == '':
        annotation, genre = take_annotation_and_genre(book_info['isbn'])

        if book_info['annotation'] != annotation or book_info['genre'] != genre:
            book_info['annotation'], book_info['genre'] = annotation, genre
            update_annotation_and_genre(book_id, annotation, genre)
    return book_info


# function return json with rated books info
@app.get("/get_rated_books/{user_id}")
def get_rated_books(user_id):
    select_query = f"""SELECT book_id 
                    FROM ratings 
                    WHERE user_id = {user_id};"""
    cur.execute(select_query)
    data = cur.fetchall()
    conn.commit()

    books_ids = []
    for book_id in data:
        books_ids.append(book_id[0])

    books_info = []
    for book_id in books_ids:
        book_info = get_book_info(book_id)
        books_info.append(book_info)
        sleep(1)

    books = {'books': books_info}
    json_books = json.dumps(books)
    return json_books


# function returns json with recommended books info
# TODO: check if ML function returns correct values
@app.get("/get_recommended_books/{user_id}_{number_of_books}")
def get_recommendations(user_id, number_of_books):
    recommendations = get_recs(user_id, number_of_books)
    books_info = []
    for rec in recommendations:
        book_info = get_book_info(rec)
        books_info.append(book_info)
        sleep(1)

    books = {'books': books_info}
    json_books = json.dumps(books)
    return json_books


# TODO: implement
def search_book(request):
    # search books in database
    # return books
    pass
