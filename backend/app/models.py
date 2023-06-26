from __future__ import annotations

from typing import List, Optional

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


class BookExt(Book):
    rating: Optional[int]
    want_to_read: Optional[bool]


class BooksResponse(BaseModel):
    items: List[BookExt]
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


class UnRateReq(BaseModel):
    book_id: int
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


class ChangePasswordReq(BaseModel):
    user_id: int
    old_password: str
    new_password: str


class WantToReadBookReq(BaseModel):
    user_id: int
    book_id: int


class UserStatusResponse(BaseModel):
    status: str
    reviewed_books: int
