from sqlalchemy.orm import Session
from sqlalchemy import exists, and_

from backend.src.models.media_user import MediaUser
from backend.src.models.users import User
from backend.src.models.media import Media
from backend.src.models.statuses import Status
from backend.src.schemas.media_user import MediaUserBase, MediaUserDelete, MediaUserUpdate

from backend.src.exceptions import NotFoundError, DuplicateEntryError


def create_media_user(db: Session, media_user: MediaUserBase):
    if not db.query(exists().where(User.id == media_user.user_id)).scalar():
        raise NotFoundError('User')

    if not db.query(exists().where(Media.id == media_user.media_id)).scalar():
        raise NotFoundError('Media')

    if not db.query(exists().where(Status.id == media_user.status_id)).scalar():
        raise NotFoundError('Status')

    if db.query(exists().where(
            and_(
                MediaUser.user_id == media_user.user_id,
                MediaUser.media_id == media_user.media_id
            )
    )).scalar():
        raise DuplicateEntryError('Media', 'User')

    try:
        db_media_user = MediaUser(
            user_id=media_user.user_id,
            media_id=media_user.media_id,
            status_id=media_user.status_id,
            date=media_user.date,
            rating=media_user.rating
        )

        db.add(db_media_user)
        db.commit()
        db.refresh(db_media_user)

        return db_media_user

    except Exception as error:
        db.rollback()
        raise error


def delete_media_user(db: Session, media_user: MediaUserDelete):
    db_media_user = db.query(MediaUser).filter(
        MediaUser.user_id == media_user.user_id,
        MediaUser.media_id == media_user.media_id
    ).first()

    if not db_media_user:
        raise NotFoundError(f"User: {media_user.user_id} with media: {media_user.media_id}")

    db.delete(db_media_user)
    db.commit()

    return db_media_user


def update_media_user(db: Session, media_user: MediaUserUpdate):
    db_media_user = db.query(MediaUser).filter(
        MediaUser.user_id == media_user.user_id,
        MediaUser.media_id == media_user.media_id
    ).first()

    if not db_media_user:
        raise NotFoundError(f"User: {media_user.user_id} with media: {media_user.media_id}")

    # TODO: Check status exists

    for key, value in media_user.model_dump().items():
        if value is not None and hasattr(db_media_user, key):
            setattr(db_media_user, key, value)

    db.commit()
    db.refresh(db_media_user)

    return db_media_user
