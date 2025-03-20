from sqlalchemy.orm import Session

from src.models.users import User
from src.schemas.users import UserBase
from src.security import hash_password

def create_user(db: Session, user: UserBase):
    errors = {}

    # Проверка email
    if db.query(User).filter(User.email == user.email).first():
        errors["email"] = "Email already registered"
    
    # Проверка login
    if db.query(User).filter(User.login == user.login).first():
        errors["login"] = "Login already registered"

    if errors:
        return {'errors': errors}

    hash_pwd = hash_password(user.password)

    new_user = User(
        name=user.name,
        login=user.login,
        email=user.email,
        password=hash_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {'message': 'User registered successfully'}
