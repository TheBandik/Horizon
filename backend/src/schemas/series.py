from typing import Optional

from pydantic import BaseModel


class SeriesBase(BaseModel):
    title: str
    parent_series_id: Optional[int]


class Series(SeriesBase):
    id: int

    class Config:
        orm_mode = True
