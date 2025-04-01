from pydantic import BaseModel


class StatusBase(BaseModel):
    name: str
    media_type_id: int


class Status(StatusBase):
    id: int

    class Config:
        orm_mode = True
