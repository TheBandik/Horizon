from sqlalchemy import Column, Integer, String

from backend.src.models.base import Base


class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
