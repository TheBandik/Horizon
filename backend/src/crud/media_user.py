from sqlalchemy.orm import Session
from sqlalchemy import exists, and_

from src.models.media_user import MediaUser
from src.models.users import User
from src.models.media import Media
from src.models.statuses import Status
from src.schemas.media_user import MediaUserBase

from src.exceptions import NotFoundError, DuplicateEntryError



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
