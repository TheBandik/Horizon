from sqlalchemy import Column, Integer, ForeignKey

from src.models.base import Base


class MediaSeries(Base):
    __tablename__ = 'media_series'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    series_id = Column(Integer, ForeignKey('series.id'))
