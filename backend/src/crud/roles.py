from sqlalchemy.orm import Session

from backend.src.models.roles import Role
from backend.src.schemas.roles import RoleBase


def create_role(db: Session, role: RoleBase):
    db_role = Role(name=role.name)

    db.add(db_role)
    db.commit()
    db.refresh(db_role)

    return db_role


def get_roles(db: Session):
    return db.query(Role).all()


def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.id == role_id).first()


def update_role(db: Session, role_id: int, role: RoleBase):
    db_role = db.query(Role).filter(Role.id == role_id).first()

    if db_role:
        db_role.name = role.name
        db.commit()
        db.refresh(db_role)

    return db_role


def delete_role(db: Session, role_id: int):
    db_role = db.query(Role).filter(Role.id == role_id).first()

    if db_role:
        db.delete(db_role)
        db.commit()

    return db_role
