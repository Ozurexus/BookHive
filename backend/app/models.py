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


class PongResponse(BaseModel):
    message: str
