from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey

from backend.src.models.base import Base
from backend.src.models.genres import Genre


class MediaGenre(Base):
    __tablename__ = 'media_genre'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    genre_id = Column(Integer, ForeignKey('genres.id'))

    media = relationship("Media", back_populates="genres")
    genre = relationship("Genre")
