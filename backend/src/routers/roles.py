from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.schemas.roles import Role, RoleBase
from backend.src.dependencies import get_db
from backend.src.crud import roles

router = APIRouter()


@router.post('/roles/', response_model=Role, tags=['Roles'])
def create_role(role: RoleBase, db: Session = Depends(get_db)):
    return roles.create_role(db=db, role=role)


@router.get('/roles/', response_model=list[Role], tags=['Roles'])
def get_roles(db: Session = Depends(get_db)):
    return roles.get_roles(db=db)


@router.get('/roles/{role_id}', response_model=Role, tags=['Roles'])
def get_role(role_id: int, db: Session = Depends(get_db)):
    db_role = roles.get_role(db=db, role_id=role_id)

    if db_role is None:
        raise HTTPException(status_code=404, detail='Role not found')

    return db_role


@router.put('/roles/{role_id}', response_model=Role, tags=['Roles'])
def update_role(role_id: int, role: RoleBase, db: Session = Depends(get_db)):
    db_role = roles.update_role(db=db, role_id=role_id, role=role)

    if db_role is None:
        raise HTTPException(status_code=404, detail='Role not found')

    return db_role


@router.delete('/roles/{role_id}', tags=['Roles'])
def delete_role(role_id: int, db: Session = Depends(get_db)):
    db_role = roles.delete_role(db=db, role_id=role_id)

    if db_role is None:
        raise HTTPException(status_code=404, detail='Role not found')

    return db_role
