from sqlalchemy import Column, Integer, String

from src.models.base import Base


class Participant(Base):
    __tablename__ = 'participants'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
