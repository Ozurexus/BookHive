from __future__ import annotations
import logging
from time import sleep
from typing import List

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from util import *
from client import *

# ------------------------------------FAST-API------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------CONFIG+DB------------------------------------
config = get_config()
db = DB(config)

# ------------------------------------ML------------------------------------
ml_client = MlClient(db.conn, is_mock=config.ml.mock, atomic_max=config.ml.ml_retrain_counter)


# ------------------------------------API------------------------------------
@app.get("/books/recommendations/{user_id}", response_model=List[int])
async def get_recommendations(user_id: int, limit: int = 3):
    try:
        book_ids = ml_client.get_recommendations(int(user_id), int(limit))
        book_ids = [int(book_id) for book_id in book_ids]
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)
    return book_ids


@app.get("/model/retrain", status_code=200)
async def retrain_model():
    try:
        ml_client.retrain_model()
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)