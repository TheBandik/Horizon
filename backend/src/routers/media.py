from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.exceptions import NotFoundError
from backend.src.schemas.media import MediaBase, MediaSearch
from backend.src.dependencies import get_db
from backend.src.crud.media import create_media, get_media, media_search

router = APIRouter()


@router.post('/media/', tags=['Media'])
def create_media_route(media: MediaBase, db: Session = Depends(get_db)):
    return create_media(db=db, media=media)


@router.get("/media/{media_id}", tags=["Media"])
def get_media_endpoint(media_id: int, db: Session = Depends(get_db)):
    try:
        return get_media(media_id=media_id, db=db)

    except NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/media/search/", response_model=list[MediaSearch], tags=["Media"])
def media_search_endpoint(title: str, db: Session = Depends(get_db)):
    try:
        return media_search(title=title, db=db)

    except Exception as error:
        print(error)
