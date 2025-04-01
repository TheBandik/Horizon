from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    token: str
    token_type: str


class UserBase(BaseModel):
    name: str
    login: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True
