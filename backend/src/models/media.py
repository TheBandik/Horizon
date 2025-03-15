from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey

from src.models.base import Base
from src.models.media_types import MediaType
from src.models.media_genre import MediaGenre
from src.models.media_person_role import MediaPersonRole
from src.models.media_company_role import MediaCompanyRole
from src.models.media_user import MediaUser


class Media(Base):
    __tablename__ = 'media'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    poster = Column(String, nullable=True)
    release_date = Column(Date, nullable=True)

    media_type_id = Column(Integer, ForeignKey('media_types.id'))
    media_type = relationship("MediaType")

    genres = relationship("MediaGenre", back_populates="media")
    persons = relationship("MediaPersonRole", back_populates="media")
    companies = relationship("MediaCompanyRole", back_populates="media")
    users = relationship("MediaUser", back_populates="media")
