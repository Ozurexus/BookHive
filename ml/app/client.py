import logging
import random

import pandas as pd
from als_pandas import train_model
from atomic import AtomicLong

MAX_BOOK_ID = 7000

def dump_rating(conn) -> pd.DataFrame:
    """
    postgres(ratings) -> pd.Dataframe
    """
    dump_query = """SELECT r.id, b.isbn AS isbn, r.user_id AS "user", r.rating AS rating, b.id AS book_id
                    FROM ratings r JOIN books b ON r.book_id = b.id"""
    df = pd.read_sql_query(dump_query, conn)
    return df


class MlClient:
    def __init__(self, conn, is_mock=True, atomic_max=5):
        logging.info(f"mock is {is_mock}")
        self.mock = is_mock
        if is_mock:
            logging.info("skipping training and dump")
            return

        self.conn = conn
        logging.info('starting dumping and training model ⏳ ⏳ ⏳....')
        try:
            logging.info('starting dumping from db...')
            df_rating = dump_rating(self.conn)
            logging.debug(df_rating.shape)
            logging.info('starting training model...')
            self.model = train_model(df_rating)
            logging.info('dumping and training model done ✅')
        except Exception as e:
            logging.error(e + " ❌")
        self.atomic_max = atomic_max
        self.counter = AtomicLong(0)

    def get_recommendations(self, user_id: int, limit: int):
        if self.mock:
            dst = []
            for i in range(limit):
                dst.append(random.randint(1, MAX_BOOK_ID))
            return dst
        return self.model.get_recommendations(user_id, limit)

    def retrain_model(self):
        if self.mock:
            logging.info("retrain model: mock...")
            return
        """
        On new user OR new rating

        Retrain model only on specific counter value
        """
        self.counter += 1
        if self.counter.value % self.atomic_max == 0:
            logging.info(f"retraining model: current={self.counter.value}, needed={self.atomic_max}")
            df_rating = dump_rating(self.conn)
            self.model = train_model(df_rating)
            return
        logging.info(f"skipping retraining model: current={self.counter.value}, need={self.atomic_max}")
