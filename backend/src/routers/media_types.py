from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.media_types import MediaType, MediaTypeBase
from src.dependencies import get_db
from src.crud import media_types as mt

router = APIRouter()

@router.post('/media-types/', response_model=MediaType)
def create_media_type(media_type: MediaTypeBase, db: Session = Depends(get_db)):
    return mt.create_media_type(db=db, media_type=media_type)

@router.get('/media-types/', response_model=list[MediaType])
def get_media_types(db: Session = Depends(get_db)):
    return mt.get_media_types(db=db)

@router.get('/media-types/{media_type_id}', response_model=MediaType)
def get_media_type(media_type_id: int, db: Session = Depends(get_db)):
    db_media_type = mt.get_media_type(db=db, media_type_id=media_type_id)
    
    if db_media_type is None:
        raise HTTPException(status_code=404, detail='MediaType not found')
    
    return db_media_type

@router.put('/media-types/{media_type_id}', response_model=MediaType)
def update_media_type(media_type_id: int, media_type: MediaTypeBase, db: Session = Depends(get_db)):
    db_media_type = mt.update_media_type(db=db, media_type_id=media_type_id, media_type=media_type)

    if db_media_type is None:
        raise HTTPException(status_code=404, detail='MediaType not found')
    
    return db_media_type

@router.delete('/media-types/{media_type_id}')
def delete_media_type(media_type_id: int, db: Session = Depends(get_db)):
    db_media_type = mt.delete_media_type(db=db, media_type_id=media_type_id)

    if db_media_type is None:
        raise HTTPException(status_code=404, detail='MediaType not found')
    
    return db_media_type
