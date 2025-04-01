from datetime import timedelta
from functools import lru_cache

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.config import Settings
from backend.src.schemas.users import UserBase, UserLogin, Token
from backend.src.dependencies import get_db
from backend.src.crud.users import create_user, auth_user
from backend.src.security import create_access_token

router = APIRouter()


@lru_cache()
def get_settings() -> Settings:
    return Settings()


@router.post('/register/', tags=['Users'])
def register_user(user: UserBase, db: Session = Depends(get_db)):
    result = create_user(db=db, user=user)

    if 'errors' in result:
        raise HTTPException(status_code=400, detail=result['errors'])

    return result


@router.post('/login/', response_model=Token, tags=['Users'])
def login_user(user: UserLogin, db: Session = Depends(get_db), settings: Settings = Depends(get_settings)):
    result = auth_user(db=db, user=user)

    if 'error' in result:
        raise HTTPException(status_code=400, detail=result['error'])

    access_token = create_access_token(
        data={'sub': user.email},
        secret_key=settings.SECRET_KEY,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        'token': access_token,
        'token_type': 'bearer'
    }
