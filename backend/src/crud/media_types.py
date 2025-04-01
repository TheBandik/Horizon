from sqlalchemy.orm import Session

from backend.src.models.media_types import MediaType
from backend.src.schemas.media_types import MediaTypeBase


def create_media_type(db: Session, media_type: MediaTypeBase):
    db_media_type = MediaType(name=media_type.name)

    db.add(db_media_type)
    db.commit()
    db.refresh(db_media_type)

    return db_media_type


def get_media_types(db: Session):
    return db.query(MediaType).all()


def get_media_type(db: Session, media_type_id: int):
    return db.query(MediaType).filter(MediaType.id == media_type_id).first()


def update_media_type(db: Session, media_type_id: int, media_type: MediaTypeBase):
    db_media_type = db.query(MediaType).filter(MediaType.id == media_type_id).first()

    if db_media_type:
        db_media_type.name = media_type.name
        db.commit()
        db.refresh(db_media_type)

    return db_media_type


def delete_media_type(db: Session, media_type_id: int):
    db_media_type = db.query(MediaType).filter(MediaType.id == media_type_id).first()

    if db_media_type:
        db.delete(db_media_type)
        db.commit()

    return db_media_type
