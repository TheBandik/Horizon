from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, SmallInteger
from sqlalchemy import MetaData

metadata = MetaData()

Base = declarative_base(metadata=metadata)

#
# Base models
#

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    login = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    media = relationship("MediaUser", back_populates="user")

class Status(Base):
    __tablename__ = 'statuses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Company(Base):
    __tablename__ = 'companies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Person(Base):
    __tablename__ = 'persons'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    photo = Column(String, nullable=True)

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class MediaType(Base):
    __tablename__ = 'media_types'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

#
# Media models
#

class Media(Base):
    __tablename__ = 'media'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    original_title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    poster = Column(String, nullable=True)
    release_date = Column(Date, nullable=True)

    media_type_id = Column(Integer, ForeignKey('media_types.id'))
    media_type = relationship("MediaType")

    genres = relationship("MediaGenre", back_populates="media")
    persons = relationship("MediaPersonRole", back_populates="media")
    companies = relationship("MediaCompanyRole", back_populates="media")
    users = relationship("MediaUser", back_populates="media")

class Series(Base):
    __tablename__ = 'series'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    parent_series_id = Column(Integer, ForeignKey('series.id'), nullable=True)
    parent_series = relationship("Series", remote_side=[id], backref="sub_series")

#
# Association models
#

class MediaGenre(Base):
    __tablename__ = 'media_genre'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    genre_id = Column(Integer, ForeignKey('genres.id'))

    media = relationship("Media", back_populates="genres")
    genre = relationship("Genre")

class MediaPersonRole(Base):
    __tablename__ = 'media_person_role'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    person_id = Column(Integer, ForeignKey('persons.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))

    media = relationship("Media", back_populates="persons")
    person = relationship("Person")
    role = relationship("Role")

class MediaCompanyRole(Base):
    __tablename__ = 'media_company_role'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    company_id = Column(Integer, ForeignKey('companies.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))

    media = relationship("Media", back_populates="companies")
    company = relationship("Company")
    role = relationship("Role")

class MediaSeries(Base):
    __tablename__ = 'media_series'

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey('media.id'))
    series_id = Column(Integer, ForeignKey('series.id'))

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
