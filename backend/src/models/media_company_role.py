from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey

from src.models.base import Base
from src.models.companies import Company


class MediaCompanyRole(Base):
    __tablename__ = 'media_company_role'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    company_id = Column(Integer, ForeignKey('companies.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))

    media = relationship("Media", back_populates="companies")
    company = relationship("Company")
    role = relationship("Role")
