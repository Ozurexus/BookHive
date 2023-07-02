import logging

import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error


class ALS_Model:
    # todo add SGD, general recs
    def __init__(self, n_iters, n_factors, reg):
        self.reg = reg
        self.n_iters = n_iters
        self.n_factors = n_factors

    def fit(self, ratings):
        self.ratings = ratings  # ideally remove and use only factors
        self.n_user, self.n_item = self.ratings.shape
        self.user_factors = np.random.random((self.n_user, self.n_factors))
        self.item_factors = np.random.random((self.n_item, self.n_factors))

        self.train_mse_record = []
        for _ in range(self.n_iters):
            self.user_factors = self._als_step(self.ratings, self.item_factors)
            self.item_factors = self._als_step(self.ratings.T, self.user_factors)
            predictions = self.predict()

            train_mse = self.compute_mse(self.ratings, predictions)
            self.train_mse_record.append(train_mse)
            logging.debug(f"MSE is {train_mse}")
        self.predictions = self.predict()
        return self

    def _als_step(self, ratings, fixed_vecs):
        A = fixed_vecs.T.dot(fixed_vecs) + np.eye(self.n_factors) * self.reg
        b = ratings.dot(fixed_vecs)
        A_inv = np.linalg.inv(A)
        return b.dot(A_inv)

    def predict(self):
        pred = self.user_factors.dot(self.item_factors.T)
        return pred

    def compute_mse(self, y_true, y_pred):
        mask = np.nonzero(y_true)
        mse = mean_squared_error(y_true[mask], y_pred[mask])
        return mse

    def get_recommendations(self, user: int, k: int):
        assert user < self.n_user  # заменю этот момент чтобы можно было дать рек новому пацану
        recs = []
        chosen = 0
        predicted_ratings = self.predictions[user]  # ndarray
        book_ids_sorted = np.argsort(predicted_ratings)

        cur_i = -1
        while chosen != k:
            cur_book_id = book_ids_sorted[cur_i]
            cur_i -= 1

            if self.ratings[user][cur_book_id] == 0:  # book is unseen
                chosen += 1
                recs.append(cur_book_id)
        return recs


def train_model(ratings_df, n_iters=20, n_factors=60, reg=0.15) -> ALS_Model:
    # нет книг без оценок!!!
    n_users = ratings_df["user"].max()
    n_items = ratings_df["book_id"].max()

    ratings = np.zeros((n_users + 1, n_items + 1))

    for row in ratings_df.itertuples(index=False):
        ratings[row.user, row.book_id] = row.rating

    als = ALS_Model(n_iters, n_factors, reg)
    als.fit(ratings)
    return als
