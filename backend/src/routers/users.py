from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.users import UserBase, UserLogin
from src.dependencies import get_db
from src.crud.users import create_user, auth_user

router = APIRouter()

@router.post('/register/', tags=['Users'])
def register_user(user: UserBase, db: Session = Depends(get_db)):
    result = create_user(db=db, user=user)

    if 'errors' in result:
        raise HTTPException(status_code=400, detail=result['errors'])

    return result

@router.post('/login/', tags=['Users'])
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    result = auth_user(db=db, user=user)

    if 'error' in result:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return result
