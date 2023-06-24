from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

from time import sleep

from models import *

# from ml.aml import get_recs
from db import *
from config import get_config
from jwt import *

from typing import List

# ------------------------------------MIDDLEWARE------------------------------------
WHITE_LIST_URLS = ['/api/docs', '/api/ping', '/api/openapi.json']


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app,
            some_attribute: str,
    ):
        super().__init__(app)
        self.some_attribute = some_attribute

    async def dispatch(self, request: Request, call_next):
        for white_url in WHITE_LIST_URLS:
            if request.url.path == white_url:
                return await call_next(request)

        token = request.headers.get('Authorization')
        if token is None:
            logging.error("empty auth header")
            return JSONResponse(status_code=401, content={
                "error": "Empty auth header"
            })

        token = token.split('Bearer ')

        if len(token) != 2:
            logging.error("Malformed Token")
            return JSONResponse(status_code=401, content={
                "error": "Malformed Token"
            })

        token = token[1]
        try:
            validate_jwt(config=config, token=token)
        except Exception as e:
            logging.error(e)
            return JSONResponse(status_code=401, content={
                "error": "invalid jwt"
            })

        response = await call_next(request)

        return response


# ------------------------------------FAST_API------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_auth = FastAPI(openapi_prefix="/auth")
app_api = FastAPI(openapi_prefix="/api")
app_api.add_middleware(AuthMiddleware, some_attribute='some_attribute')
app.mount('/auth', app_auth)
app.mount('/api', app_api)


@app.get("/ping", response_model=PongResponse)
async def ping():
    return PongResponse(message="pong")


# ------------------------------------CONFIG_DB------------------------------------
config = get_config()
db = DB(config.PostgresConfig)


# ------------------------------------API------------------------------------


@app_api.get("/get_rated_books/{user_id}", response_model=GetRatedBooksResponse)
async def get_rated_books(user_id):
    # getting book_ids
    try:
        books: List[Book] = db.get_user_recommended_books(user_id)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)
    return GetRatedBooksResponse(items=books, size=len(books))


@app_api.get("/get_recommended_books/{user_id}_{number_of_books}")
async def get_recommendations(user_id, number_of_books):
    recommendations = get_recs(user_id, number_of_books)
    books_info = []
    for rec in recommendations:
        book_info = db.get_book_info(rec)
        books_info.append(book_info)
        sleep(1)  # ???
    books = {"books": books_info}
    return books


@app_api.get("/books/find/", response_model=BooksByPatternResponse)
async def books_find_by_pattern(pattern: str = "", limit: int = 0):
    try:
        books: List[BooksByPatternItem] = db.find_books_by_title_pattern(pattern, limit)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    return BooksByPatternResponse(items=books, size=len(books))


@app_api.post("/books/rate/")
async def books_rate(rate_req: RateReq):
    try:
        db.rate_book(rate_req)
    except ConstraintError as e:
        logging.error(e)
        raise HTTPException(status_code=400, detail="Invalid request body (fix it)")
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)


# ------------------------------------------------------AUTH------------------------------------------------------------------------
@app_auth.post('/users/register', response_model=UserRegisterResp)
async def register_user(register_req: UserRegisterReq):
    try:
        user = db.register_user(register_req, hash_password(register_req.password, config.BackendConfig.password_salt))
    except UserAlreadyExists as e:
        logging.error(e)
        raise HTTPException(status_code=409, detail="User already exists")
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    access_token = create_access_token(
        config=config,
        user=user
    )
    token = JWT(access_token=access_token, refresh_token='refresh')
    resp = UserRegisterResp(user_id=user.id, jwt=token)

    return resp


@app_auth.post('/users/login', response_model=UserLoginResp)
async def login_user(login_req: UserLoginReq):
    try:
        user = db.login_user(login_req, hash_password(login_req.password, config.BackendConfig.password_salt))
    except UserNotFound as e:
        logging.error(e)
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    access_token = create_access_token(
        config=config,
        user=user
    )
    token = JWT(access_token=access_token, refresh_token='refresh')
    resp = UserRegisterResp(user_id=user.id, jwt=token)

    return resp


# @app_auth.post('/users/change_password', response_model=UserLoginResp)
# async def login_user(login_req: ChangePasswordReq):
#     try:
#         user = db.login_user(login_req, hash_password(login_req.password, config.BackendConfig.password_salt))
#     except UserNotFound as e:
#         logging.error(e)
#         raise HTTPException(status_code=404, detail="User not found")
#     except Exception as e:
#         logging.error(e)
#         raise HTTPException(status_code=500)
#
#     access_token = create_access_token(
#         config=config,
#         user=user
#     )
#     token = JWT(access_token=access_token, refresh_token='refresh')
#     resp = UserRegisterResp(user_id=user.id, jwt=token)
#
#     return resp
