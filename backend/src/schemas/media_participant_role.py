from pydantic import BaseModel


class MediaParticipantRoleBase(BaseModel):
    media_id: int
    participant_id: int
    role_id: int

class MediaParticipantRole(MediaParticipantRoleBase):
    id: int

    class Config:
        orm_mode = True
