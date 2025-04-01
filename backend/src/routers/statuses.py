from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.src.schemas.statuses import Status, StatusBase
from backend.src.crud import statuses as crudst
from backend.src.dependencies import get_db

router = APIRouter()


@router.post('/statuses/', response_model=Status, tags=['Status'])
def create_status(status: StatusBase, db: Session = Depends(get_db)):
    return crudst.create_status(status=status, db=db)


@router.get('/statuses/', response_model=list[Status], tags=['Status'])
def get_statuses(db: Session = Depends(get_db)):
    return crudst.get_statuses(db=db)


@router.get('/statuses/{status_id}', response_model=Status, tags=['Status'])
def get_status(status_id: int, db: Session = Depends(get_db)):
    return crudst.get_status(status_id=status_id, db=db)
