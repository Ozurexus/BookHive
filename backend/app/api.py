from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from time import sleep

from models import *

# from ml.aml import get_recs
from db import DB, ConstraintError
from config import get_config

from typing import List

app = FastAPI()
config = get_config()
db = DB(config.PostgresConfig)


@app.get("/ping", response_model=PongResponse)
async def ping():
    return PongResponse(message="pong")


@app.get("/get_rated_books/{user_id}", response_model=GetRatedBooksResponse)
async def get_rated_books(user_id):
    # getting book_ids
    try:
        books: List[Book] = db.get_user_recommended_books(user_id)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)
    return GetRatedBooksResponse(items=books, size=len(books))


@app.get("/get_recommended_books/{user_id}_{number_of_books}")
async def get_recommendations(user_id, number_of_books):
    recommendations = get_recs(user_id, number_of_books)
    books_info = []
    for rec in recommendations:
        book_info = db.get_book_info(rec)
        books_info.append(book_info)
        sleep(1)  # ???
    books = {"books": books_info}
    return books


@app.get("/books/find/", response_model=BooksByPatternResponse)
async def books_find_by_pattern(pattern: str = "", limit: int = 0):
    try:
        books: List[BooksByPatternItem] = db.find_books_by_title_pattern(pattern, limit)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    return BooksByPatternResponse(items=books, size=len(books))


@app.post("/books/rate/")
async def books_rate(rate_req: RateReq):
    try:
        db.rate_book(rate_req)
    except ConstraintError as e:
        logging.error(e)
        raise HTTPException(status_code=400, detail="Invalid request body (fix it)")
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)
