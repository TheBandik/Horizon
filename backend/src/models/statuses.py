from sqlalchemy import Column, Integer, String

from src.models.base import Base


class Status(Base):
    __tablename__ = 'statuses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
