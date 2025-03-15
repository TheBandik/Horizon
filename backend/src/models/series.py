from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, String

from src.models.base import Base


class Series(Base):
    __tablename__ = 'series'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    parent_series_id = Column(Integer, ForeignKey('series.id'), nullable=True)
    parent_series = relationship("Series", remote_side=[id], backref="sub_series")
