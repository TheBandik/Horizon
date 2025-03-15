from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey

from src.models.base import Base
from src.models.persons import Person
from src.models.roles import Role


class MediaPersonRole(Base):
    __tablename__ = 'media_person_role'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    person_id = Column(Integer, ForeignKey('persons.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))

    media = relationship("Media", back_populates="persons")
    person = relationship("Person")
    role = relationship("Role")
