from typing import Optional
from datetime import date

from pydantic import BaseModel


class MediaUserBase(BaseModel):
    user_id: int
    media_id: int
    status_id: int
    date: Optional[date]
    rating: Optional[int]


class MediaUserDelete(BaseModel):
    user_id: int
    media_id: int


class MediaUserUpdate(BaseModel):
    user_id: int
    media_id: int
    status_id: Optional[int]
    rating: Optional[int]
    date: Optional[date]


class MediaUser(MediaUserBase):
    id: int

    class Config:
        orm_mode = True
