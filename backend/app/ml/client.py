import logging

import pandas as pd
from ml.als_pandas import train_model
from atomic import AtomicLong


def dump_rating(conn) -> pd.DataFrame:
    """
    postgres(ratings) -> pd.Dataframe
    """
    dump_query = """SELECT r.id, b.isbn AS isbn, r.user_id AS "user", r.rating AS rating, b.id AS book_id
                    FROM ratings r JOIN books b ON r.book_id = b.id"""
    df = pd.read_sql_query(dump_query, conn)
    return df


class MlClient:
    def __init__(self, conn, atomic_max=5):
        self.conn = conn
        df_rating = dump_rating(self.conn)
        self.model = train_model(df_rating)
        self.atomic_max = atomic_max
        self.counter = AtomicLong(0)

    def get_recommendations(self, user_id: int, limit: int):
        return self.model.get_recommendations(user_id, limit)

    def retrain_model(self):
        """
        On new user OR new rating

        Retrain model only on specific counter value
        """
        self.counter += 1
        if self.counter.value % self.atomic_max == 0:
            logging.debug(f"retraining model: current={self.counter.value}, needed={self.atomic_max}")
            df_rating = dump_rating(self.conn)
            self.model = train_model(df_rating)
            return
        logging.debug(f"skipping retraining model: current={self.counter.value}, need={self.atomic_max}")