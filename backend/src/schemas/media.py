from typing import Optional, List, Dict
from datetime import date

from pydantic import BaseModel, Field


class MediaBase(BaseModel):
    title: str
    original_title: Optional[str]
    release_date: Optional[date]
    description: Optional[str]
    media_type: str
    genres: Optional[List[str]] = Field(default_factory=list)
    participants: Optional[List[Dict[str, str]]]
    poster: Optional[str] 

class Media(MediaBase):
    id: int

    class Config:
        orm_mode = True
