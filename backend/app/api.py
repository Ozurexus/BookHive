from __future__ import annotations
import logging
from time import sleep

from fastapi import FastAPI, HTTPException, Request as FastApiRequest, Header
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from models import *

from ml.client import MlClient
from db import *
from config import get_config
from jwt import *
from util import *
from typing import List, Annotated

# ------------------------------------MIDDLEWARE------------------------------------
WHITE_LIST_URLS = ["/api/docs", "/api/ping", "/api/openapi.json"]


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app,
            some_attribute: str,
    ):
        super().__init__(app)
        self.some_attribute = some_attribute

    async def dispatch(self, request: FastApiRequest, call_next):
        if not config.BackendConfig.with_auth:
            response = await call_next(request)
            return response

        for white_url in WHITE_LIST_URLS:
            if request.url.path == white_url:
                return await call_next(request)

        token = request.headers.get("Authorization")
        if token is None:
            logging.error("empty auth header")
            return JSONResponse(status_code=401, content={"error": "Empty auth header"})

        token = token.split("Bearer ")

        if len(token) != 2:
            logging.error("Malformed Token")
            return JSONResponse(status_code=401, content={"error": "Malformed Token"})

        token = token[1]
        try:
            validate_jwt(config=config, token=token)
        except Exception as e:
            logging.error(e)
            return JSONResponse(status_code=401, content={"error": "invalid jwt"})

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
app_api.add_middleware(AuthMiddleware, some_attribute="some_attribute")
app.mount("/auth", app_auth)
app.mount("/api", app_api)


@app.get("/ping", response_model=PongResponse)
async def ping():
    return PongResponse(message="pong")


# ------------------------------------CONFIG+DB------------------------------------
config = get_config()
db = DB(config)

# ------------------------------------ML------------------------------------
ml_client = MlClient(config.BackendConfig.ml_addr)

# ------------------------------------STATIC---------------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")


# ------------------------------------API------------------------------------
@app_api.get("/books/find/", response_model=BooksByPatternResponse)
async def books_find_by_pattern(pattern: str = "", limit: int = 0, by_author: bool = False):
    """
    limit: ограничение на результат

    by_author: поиск по автору (если не стоит флаг, то по книге)
    """
    if pattern == "":
        books = []
        return BooksByPatternResponse(items=books, size=len(books))
    try:
        books: List[BooksByPatternItem] = db.find_books_by_title_pattern(pattern, limit, by_author)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    return BooksByPatternResponse(items=books, size=len(books))


@app_api.post("/books/rate/", status_code=200)
async def books_rate(rate_req: RateReq):
    try:
        db.rate_book(rate_req)
    except ConstraintError as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=400, detail="Invalid request body (fix it)")
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    try:
        ml_client.retrain_model()
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)


@app_api.post("/books/unrate", status_code=200)
async def books_rate(rate_req: UnRateReq):
    try:
        db.un_rate_book(rate_req)
    except ConstraintError as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=400, detail="Invalid request body (fix it)")
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)


@app_api.post("/books/wish/", status_code=200)
async def wish_un_wish_book(rate_req: WantToReadBookReq):
    """
    If book is already wished - then removes the book from wishes.
    Else adds the book to the wishes.
    P.S - wish ~ want_to_read
    """
    try:
        db.wish_unwish_book(rate_req)
    except ConstraintError as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(
            status_code=400, detail="Invalid request body (book_id or user_id)"
        )
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)


@app_api.get("/user/books/recommendation/", response_model=BooksExtResponse)
async def get_recommendations(limit: int = 3, Authorization: str = Header(None)):
    """
    Из мл модели
    """
    try:
        user: User = get_user_from_jwt(config, Authorization)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=401)

    try:
        book_ids = ml_client.get_recommendations(int(user.id), int(limit))
        book_ids = [int(book_id) for book_id in book_ids]
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    try:
        books = db.get_books_by_ids(book_ids, user.id)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)
    resp = BooksExtResponse(items=books, size=len(books))
    return resp


@app_api.get("/user/rated_books/", response_model=BooksExtResponse)
async def get_rated_books(Authorization: str = Header(None)):
    try:
        user: User = get_user_from_jwt(config, Authorization)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=401)

    try:
        books: List[Book] = db.get_user_recommended_books(user.id)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)
    return BooksExtResponse(items=books, size=len(books))


@app_api.get("/user/wish_list/", response_model=BooksExtResponse)
async def get_user_wishes_books(Authorization: str = Header(None)):
    """Получить списпок желаемых книг текущего юзера"""
    try:
        user: User = get_user_from_jwt(config, Authorization)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=401)

    try:
        books = db.get_user_favorite_books(user.id)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)
    resp = BooksExtResponse(items=books, size=len(books))
    return resp


@app_api.get("/user/status/", response_model=UserStatusResponse)
async def get_user_status(Authorization: str = Header(None)):
    """Получить статус и кол-во книг"""
    try:
        user: User = get_user_from_jwt(config, Authorization)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=401)

    try:
        review_books_num = db.get_user_reviewed_books_num(user.id)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    return UserStatusResponse(
        status=calculate_user_status(review_books_num), reviewed_books=review_books_num
    )


@app_api.delete("/user/me", response_model=None)
async def delete_me(Authorization: str = Header(None)):
    """Юзер id из jwt берет.

    Через swagger запрос не делается - Authorization зарезирвирован сваггером.

    Делай так - curl -X DELETE -H "Authorization: Bearer TOKEN" http://127.0.0.1:8080/api/user/me.
    """
    try:
        user: User = get_user_from_jwt(config, Authorization)
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=401)

    try:
        db.delete_account(user.id)
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    return Response(status_code=200)


# ------------------------------------------------------AUTH------------------------------------------------------------------------
@app_auth.post("/users/register", response_model=UserRegisterResp)
async def register_user(register_req: UserRegisterReq):
    if not register_req.valid():
        raise HTTPException(
            status_code=400,
            detail="Empty login or password",
        )
    try:
        user = db.register_user(
            register_req,
            hash_password(register_req.password, config.BackendConfig.password_salt),
        )
    except UserAlreadyExists as e:
        logging.error(e)
        raise HTTPException(
            status_code=409,
            detail="User with such login already exists: try choose another login",
        )
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    try:
        ml_client.retrain_model()
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500)

    access_token = create_access_token(config=config, user=user)
    token = JWT(access_token=access_token, refresh_token="refresh")
    resp = UserRegisterResp(user_id=user.id, jwt=token)

    return resp


@app_auth.post("/users/login", response_model=UserLoginResp)
async def login_user(login_req: UserLoginReq):
    try:
        user = db.login_user(
            login_req,
            hash_password(login_req.password, config.BackendConfig.password_salt),
        )
    except NotFound as e:
        logging.error(e)
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    access_token = create_access_token(config=config, user=user)
    token = JWT(access_token=access_token, refresh_token="refresh")
    resp = UserRegisterResp(user_id=user.id, jwt=token)

    return resp


@app_auth.post("/users/change_password")
async def change_user_password(req: ChangePasswordReq):
    try:
        old_password_hash = hash_password(
            req.old_password, config.BackendConfig.password_salt
        )
        new_password_hash = hash_password(
            req.new_password, config.BackendConfig.password_salt
        )
        db.change_password(req.user_id, old_password_hash, new_password_hash)
    except NotFound as e:
        logging.error(e)
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        db.rollback()
        logging.error(e)
        raise HTTPException(status_code=500)

    return Response(status_code=200)
