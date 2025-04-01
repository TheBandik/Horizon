from sqlalchemy.orm import Session

from backend.src.models.media_participant_role import MediaParticipantRole
from backend.src.schemas.media_participant_role import MediaParticipantRoleBase


def create_media_participant_role(db: Session, media_participant_role: MediaParticipantRoleBase):
    db_media_participant_role = MediaParticipantRole(
        media_id=media_participant_role.media_id,
        participant_id=media_participant_role.participant_id,
        role_id=media_participant_role.role_id
    )

    db.add(db_media_participant_role)
    db.commit()
    db.refresh(db_media_participant_role)

    return db_media_participant_role
