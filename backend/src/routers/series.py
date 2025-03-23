from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.schemas.series import Series, SeriesBase
from src.crud import series as scrud
from src.dependencies import get_db

router = APIRouter()

@router.post('/series/', response_model=Series)
def create_series(series: SeriesBase, db: Session = Depends(get_db)):
    return scrud.create_series(db=db, series=series)

@router.get('/series/', response_model=list[Series])
def get_all_series(db: Session = Depends(get_db)):
    return scrud.get_all_series(db=db)

@router.get('/series/{series_id}', response_model=Series)
def get_series(series_id: int, db: Session = Depends(get_db)):
    return scrud.get_series(db=db, series_id=series_id)
