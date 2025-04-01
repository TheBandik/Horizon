from sqlalchemy.orm import Session

from backend.src.schemas.statuses import StatusBase
from backend.src.models.statuses import Status


def create_status(db: Session, status: StatusBase):
    db_status = Status(
        name=status.name,
        media_type_id=status.media_type_id
    )

    db.add(db_status)
    db.commit()
    db.refresh(db_status)

    return db_status


def get_statuses(db: Session):
    return db.query(Status).all()


def get_status(db: Session, status_id: int):
    db_status = db.query(Status).filter(Status.id == status_id).first()

    return db_status
