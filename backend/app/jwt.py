from __future__ import annotations
import hashlib
from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

from config import Config
from models import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str, salt: str) -> str:
    salted_password = password + salt
    salted_password_bytes = salted_password.encode("utf-8")
    hashed_password = hashlib.sha256(salted_password_bytes).hexdigest()

    return str(hashed_password)


def create_access_token(
        config: Config, user: User, expires_delta: timedelta | None = None
):
    payload = user.__dict__
    to_encode = payload.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.BackendConfig.tokenTTL)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        config.BackendConfig.jwt_key,
        algorithm=config.BackendConfig.algorithm,
    )
    return encoded_jwt


def validate_jwt(config: Config, token: str) -> User:
    payload = jwt.decode(
        token, config.BackendConfig.jwt_key, algorithms=[config.BackendConfig.algorithm]
    )
    user = User(
        id=payload["id"], login=payload["login"], password_hash=payload["password_hash"]
    )

    return user


def get_user_from_jwt(conf: Config, auth_header: str):
    token = auth_header.split("Bearer ")
    return validate_jwt(conf, token[1])
