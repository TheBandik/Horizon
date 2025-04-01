from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey

from backend.src.models.base import Base
from backend.src.models.participants import Participant
from backend.src.models.roles import Role


class MediaParticipantRole(Base):
    __tablename__ = 'media_participant_role'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    participant_id = Column(Integer, ForeignKey('participants.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))

    media = relationship("Media", back_populates="participants")
    company = relationship("Participant")
    role = relationship("Role")
