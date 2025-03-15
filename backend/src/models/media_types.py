from sqlalchemy import Column, Integer, String

from src.models.base import Base


class MediaType(Base):
    __tablename__ = 'media_types'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
