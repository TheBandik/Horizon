from typing import Optional
from datetime import date

from pydantic import BaseModel

class MediaUserBase(BaseModel):
    user_id: int
    media_id: int
    status_id: int
    date: Optional[date]
    rating: Optional[int]

class MediaUser(MediaUserBase):
    id: int

    class Config:
        orm_mode = True
