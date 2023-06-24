from __future__ import annotations

from typing import List

from pydantic import BaseModel


class Book(BaseModel):
    id: int
    isbn: str
    title: str
    author: str
    year_of_publication: int
    publisher: str
    image_url_s: str
    image_url_m: str
    image_url_l: str
    genre: str
    annotation: str


class GetRatedBooksResponse(BaseModel):
    items: List[Book]
    size: int


class BooksByPatternItem(BaseModel):
    book_id: int
    title: str
    author: str
    image_link_small: str


class BooksByPatternResponse(BaseModel):
    items: List[BooksByPatternItem]
    size: int


class RateReq(BaseModel):
    book_id: int
    rate: int
    user_id: int


class User(BaseModel):
    id: int
    login: str
    password_hash: str


class PongResponse(BaseModel):
    message: str


class JWT(BaseModel):
    access_token: str
    refresh_token: str


class UserRegisterReq(BaseModel):
    login: str
    password: str


class UserRegisterResp(BaseModel):
    user_id: int
    jwt: JWT


class UserLoginReq(BaseModel):
    login: str
    password: str


class UserLoginResp(BaseModel):
    user_id: int
    jwt: JWT
