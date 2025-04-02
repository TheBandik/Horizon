from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.crud.media_user import delete_media_user, update_media_user
from backend.src.schemas.media_user import MediaUserBase, MediaUserDelete, MediaUserUpdate
from backend.src.dependencies import get_db
from backend.src.exceptions import NotFoundError, DuplicateEntryError

from backend.src.crud import media_user as mu

router = APIRouter()


@router.post('/media-user/', tags=['MediaUser'])
def create_media_user(media_user: MediaUserBase, db: Session = Depends(get_db)):
    try:
        return mu.create_media_user(media_user=media_user, db=db)

    except NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))

    except DuplicateEntryError as error:
        raise HTTPException(status_code=409, detail=str(error))

    except Exception as error:
        raise HTTPException(status_code=500, detail='Internal server error')


@router.delete("/media-user/", tags=["MediaUser"])
def delete_media_user_endpoint(media_user: MediaUserDelete, db: Session = Depends(get_db)):
    try:
        return delete_media_user(media_user=media_user, db=db)

    except NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.patch("/media-user/", tags=["MediaUser"])
def update_media_user_endpoint(media_user: MediaUserUpdate, db: Session = Depends(get_db)):
    try:
        return update_media_user(media_user=media_user, db=db)

    except NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
