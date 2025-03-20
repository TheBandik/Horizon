from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.users import UserBase
from src.dependencies import get_db
from src.crud.users import create_user

router = APIRouter()

@router.post('/register/')
def register_user(user: UserBase, db: Session = Depends(get_db)):
    result = create_user(db=db, user=user)

    if 'errors' in result:
        raise HTTPException(status_code=400, detail=result['errors'])

    return result
