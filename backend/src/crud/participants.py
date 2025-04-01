from sqlalchemy.orm import Session

from backend.src.models.participants import Participant
from backend.src.schemas.participants import ParticipantBase


def create_participant(db: Session, participant: ParticipantBase):
    db_participant = Participant(name=participant.name)

    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)

    return db_participant


def get_participants(db: Session):
    return db.query(Participant).all()


def get_participant(db: Session, participant_id: int):
    return db.query(Participant).filter(Participant.id == participant_id).first()


def update_participant(db: Session, participant_id: int, participant: ParticipantBase):
    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()

    if db_participant:
        db_participant.name = participant.name
        db.commit()
        db.refresh(db_participant)

    return db_participant


def delete_participant(db: Session, participant_id: int):
    db_participant = db.query(Participant).filter(Participant.id == participant_id).first()

    if db_participant:
        db.delete(db_participant)
        db.commit()

    return db_participant
