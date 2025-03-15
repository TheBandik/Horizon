from sqlalchemy import Column, Integer, String

from src.models.base import Base


class Person(Base):
    __tablename__ = 'persons'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    photo = Column(String, nullable=True)
