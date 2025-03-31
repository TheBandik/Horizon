from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from src.models.base import Base
from src.models.media_types import MediaType


class Status(Base):
    __tablename__ = 'statuses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    media_type_id = Column(Integer, ForeignKey('media_types.id'))
    media_type = relationship("MediaType")
