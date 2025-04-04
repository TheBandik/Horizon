from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.src.exceptions import NotFoundError
from backend.src.models.media import Media
from backend.src.models.media_series import MediaSeries
from backend.src.models.media_types import MediaType
from backend.src.models.media_genre import MediaGenre
from backend.src.models.genres import Genre
from backend.src.models.participants import Participant
from backend.src.models.media_participant_role import MediaParticipantRole
from backend.src.models.roles import Role
from backend.src.schemas.media import MediaBase


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

    if media.genre_ids:
        for genre_id in media.genre_ids:
            db_media_genre = MediaGenre(media_id=db_media.id, genre_id=genre_id)
            db.add(db_media_genre)

    if media.participant_ids:
        for participant in media.participants:
            db_media_participant_role = MediaParticipantRole(media_id=db_media.id, participant_id=participant[0],
                                                             role_id=participant[1])
            db.add(db_media_participant_role)

    if media.series_ids:
        for series_id in media.series_ids:
            db_media_series = MediaSeries(media_id=db_media.id, series_id=series_id)
            db.add(db_media_series)

    db.commit()

    return {"message": "Media was created"}


def get_all_media(db: Session):
    return db.query().all()


def get_media(db: Session, media_id: int):
    db_media = db.query(Media).filter(Media.id == media_id).first()

    if not db_media:
        raise NotFoundError(f"Media with id: {media_id}")

    return db_media


def media_search(db: Session, title: str):
    db_media = db.query(Media).filter(or_(
        Media.title.ilike(f"%{title}%"),
        Media.original_title.ilike(f"%{title}%")
    )).all()

    return db_media
