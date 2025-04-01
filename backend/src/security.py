from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from jose import jwt

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def hash_password(password):
    return pwd_context.hash(password)


def verify_passwod(password, hash_password):
    return pwd_context.verify(password, hash_password)


def create_access_token(data: dict, secret_key: str, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm="HS256")
