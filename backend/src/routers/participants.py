from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.schemas.participants import Participant, ParticipantBase
from backend.src.dependencies import get_db
from backend.src.crud import participants

router = APIRouter()


@router.post('/participants/', response_model=Participant, tags=['Participants'])
def create_participant(participant: ParticipantBase, db: Session = Depends(get_db)):
    return participants.create_participant(db=db, participant=participant)


@router.get('/participants/', response_model=list[Participant], tags=['Participants'])
def get_participants(db: Session = Depends(get_db)):
    return participants.get_participants(db=db)


@router.get('/participants/{participant_id}', response_model=Participant, tags=['Participants'])
def get_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = participants.get_participant(db=db, participant_id=participant_id)

    if db_participant is None:
        raise HTTPException(status_code=404, detail='participant not found')

    return db_participant


@router.put('/participants/{participant_id}', response_model=Participant, tags=['Participants'])
def update_participant(participant_id: int, participant: ParticipantBase, db: Session = Depends(get_db)):
    db_participant = participants.update_participant(db=db, participant_id=participant_id, participant=participant)

    if db_participant is None:
        raise HTTPException(status_code=404, detail='MediaType not found')

    return db_participant


@router.delete('/participants/{participant_id}', tags=['Participants'])
def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    db_participant = participants.delete_participant(db=db, participant_id=participant_id)

    if db_participant is None:
        raise HTTPException(status_code=404, detail='MediaType not found')

    return db_participant
