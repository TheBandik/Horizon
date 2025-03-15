from sqlalchemy.orm import Session

from src.models.media import Media
from src.schemas.media import MediaBase


def create_media(db: Session, media: MediaBase):
    db_media = Media(
        title=media.title,
        original_title=media.original_title,
        description=media.description,
        poster=media.poster,
        release_date=media.release_date,
        media_type_id=media.media_type_id
    )

    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    
    return db_media
