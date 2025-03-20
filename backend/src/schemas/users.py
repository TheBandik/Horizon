from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    login: str
    email: EmailStr
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
