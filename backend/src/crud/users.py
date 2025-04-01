from sqlalchemy.orm import Session

from backend.src.models.users import User
from backend.src.schemas.users import UserBase, UserLogin
from backend.src.security import hash_password, verify_passwod


def create_user(db: Session, user: UserBase):
    errors = {}

    # Проверка email
    if db.query(User).filter(User.email == user.email).first():
        errors['email'] = 'Email already registered'

    # Проверка login
    if db.query(User).filter(User.login == user.login).first():
        errors['login'] = 'Login already registered'

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


def auth_user(db: Session, user: UserLogin):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_passwod(user.password, db_user.password):
        return {'error': 'Invalid email or password'}

    return {'message': 'Login successful'}
