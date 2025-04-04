from typing import Optional, List, Dict
from datetime import date

from pydantic import BaseModel, Field


class MediaBase(BaseModel):
    title: str
    original_title: Optional[str]
    description: Optional[str]
    poster: Optional[str]
    release_date: Optional[date]

    media_type_id: int
    genre_ids: Optional[List[int]]
    participant_ids: Optional[List[Dict[int, int]]]
    series_ids: Optional[List[int]]


class MediaSearch(BaseModel):
    id: int
    title: str
    media_type_id: int
    poster: Optional[str]


class Media(MediaBase):
    id: int

    class Config:
        orm_mode = True
