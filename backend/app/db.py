import psycopg2
import requests

from config import Postgres


class DB:
    def __init__(self, conf: Postgres):
        print("connecting to postgres...")
        self.conn = psycopg2.connect(
            dbname=conf.database, user=conf.user, password=conf.password, host=conf.host, port=int(conf.port)
        )
        self.cur = self.conn.cursor()
        print('connected!')

    def update_annotation_and_genre(self, book_id, annotation, genre):
        update_query = f"""UPDATE books
                        SET annotation = %s, genre = %s
                        WHERE id = %s"""
        self.cur.execute(update_query, (annotation, genre, book_id))
        self.conn.commit()
        print('annotation and genre updated!')

    def get_book_info(self, book_id):
        select_query = f"""SELECT * FROM books WHERE id = %s"""
        self.cur.execute(select_query, (book_id, ))
        data = self.cur.fetchone()
        self.conn.commit()
        book_info = {'isbn': data[1], 'title': data[2], 'author': data[3], 'year_of_publication': data[4],
                     'publisher': data[5], 'image_url_s': data[6], 'image_url_m': data[7], 'image_url_l': data[8],
                     'genre': data[9], 'annotation': data[10]}
        if book_info['genre'] == '' and book_info['annotation'] == '':
            annotation, genre = take_annotation_and_genre(book_info['isbn'])
            if book_info['annotation'] != annotation or book_info['genre'] != genre:
                book_info['annotation'], book_info['genre'] = annotation, genre
                self.update_annotation_and_genre(book_id, annotation, genre)
        return book_info


def take_annotation_and_genre(isbn):
    print('take_annotation_and_genre')
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
