from sqlalchemy import Column, Integer, String

from backend.src.models.base import Base


class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
