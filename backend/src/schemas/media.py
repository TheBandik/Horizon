from typing import Optional
from datetime import date

from pydantic import BaseModel

class MediaBase(BaseModel):
    title: str
    original_title: Optional[str] = None
    description: Optional[str] = None
    poster: Optional[str] = None
    release_date: Optional[date] = None
    media_type_id: int

class Media(MediaBase):
    id: int

    class Config:
        orm_mode = True
