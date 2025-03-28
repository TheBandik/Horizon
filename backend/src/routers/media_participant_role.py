from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.schemas.media_participant_role import MediaParticipantRole, MediaParticipantRoleBase
from src.dependencies import get_db
from src.crud import media_participant_role as mpr

router = APIRouter()

@router.post('/media-participant-role/', response_model=MediaParticipantRole, tags=['MediaParticipantRole'])
def create_media_participant_role(media_participant_role: MediaParticipantRoleBase, db: Session = Depends(get_db)):
    return mpr.create_media_participant_role(db=db, media_participant_role=media_participant_role)
