from backend.src.db.session import SessionLocal
from backend.src.aws import S3


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_s3() -> S3:
    return S3()
