from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.schemas.media import MediaBase
from src.dependencies import get_db
from src.crud.media import create_media

router = APIRouter()

@router.post('/media/', tags=['Media'])
def create_media_route(media: MediaBase, db: Session = Depends(get_db)):
    return create_media(db=db, media=media)
