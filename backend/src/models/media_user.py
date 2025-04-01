from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, Date, SmallInteger

from backend.src.models.base import Base
from backend.src.models.statuses import Status
from backend.src.models.users import User


class MediaUser(Base):
    __tablename__ = 'media_user'

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=True)
    rating = Column(SmallInteger, nullable=True)

    media_id = Column(Integer, ForeignKey('media.id'))
    status_id = Column(Integer, ForeignKey('statuses.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    media = relationship("Media", back_populates="users")
    status = relationship("Status")
    user = relationship("User", back_populates="media")
