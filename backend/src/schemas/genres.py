from pydantic import BaseModel


class GenreBase(BaseModel):
    name: str


class Genre(GenreBase):
    id: int

    class Config:
        orm_mode = True
