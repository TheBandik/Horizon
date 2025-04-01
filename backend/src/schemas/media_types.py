from pydantic import BaseModel


class MediaTypeBase(BaseModel):
    name: str


class MediaType(MediaTypeBase):
    id: int

    class Config:
        orm_mode = True
