from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String

from backend.src.models.base import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    login = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    media = relationship("MediaUser", back_populates="user")
