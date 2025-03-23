from sqlalchemy.orm import Session

from src.schemas.series import SeriesBase
from src.models.series import Series

def create_series(db: Session, series: SeriesBase):
    db_series = Series(
        title=series.title, 
        parent_series_id=series.parent_series_id
    )

    db.add(db_series)
    db.commit()
    db.refresh(db_series)

    return db_series

def get_all_series(db: Session):
    return db.query(Series).all()

def get_series(db: Session, series_id: int):
    return db.query(Series).filter(Series.id == series_id).first()
