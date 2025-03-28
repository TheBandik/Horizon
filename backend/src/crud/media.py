import base64

from sqlalchemy.orm import Session

from src.models.media import Media
from src.models.media_types import MediaType
from src.models.media_genre import MediaGenre
from src.models.genres import Genre
from src.models.participants import Participant
from src.models.media_participant_role import MediaParticipantRole
from src.models.roles import Role
from src.schemas.media import MediaBase


def create_media(db: Session, media: MediaBase):
    
    db_media = Media(
        title=media.title,
        original_title=media.original_title,
        description=media.description,
        poster=base64.b64decode(media.poster),
        release_date=media.release_date,
        media_type_id=media.media_type
    )

    db.add(db_media)
    db.commit()
    db.refresh(db_media)

    for genre in media.genres:
        db_media_genre = MediaGenre(media_id=db_media.id, genre_id=genre)
        db.add(db_media_genre)

    for participant in media.participants:
        participant_id = db.query(Participant).filter(Participant.name == participant['participant']).first().id
        role_id = db.query(Role).filter(Role.name == participant['role']).first().id
        db_media_participant_role = MediaParticipantRole(media_id=db_media.id, participant_id=participant_id, role_id=role_id)
        db.add(db_media_participant_role)

    db.commit()
    
    return True
