from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.media_user import MediaUserBase
from src.dependencies import get_db
from src.exceptions import NotFoundError, DuplicateEntryError

from src.crud import media_user as mu

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
