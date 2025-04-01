from pydantic_settings import BaseSettings
from datetime import timedelta


class Settings(BaseSettings):
    SECRET_KEY: str = "e2c9a0b9d8f4c3a7b1e6f3d4c5a2b9d8e7f6c3a2b1d8f4e7c9a0b9d8f4c3a7b1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: float = 30.0

    class Config:
        env_file = ".env"
