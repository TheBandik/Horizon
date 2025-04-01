from pydantic import BaseModel


class ParticipantBase(BaseModel):
    name: str


class Participant(ParticipantBase):
    id: int

    class Config:
        orm_mode = True
