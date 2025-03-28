from sqlalchemy.orm import Session

from src.models.genres import Genre
from src.schemas.genres import GenreBase


def create_genre(db: Session, genre: GenreBase):
    db_genre = Genre(name=genre.name)

    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)

    return db_genre

def get_genres(db: Session):
    return db.query(Genre).all()

def get_genre(db: Session, genre_id: int):
    return db.query(Genre).filter(Genre.id == genre_id).first()

def update_genre(db: Session, genre_id: int, genre: GenreBase):
    db_genre = db.query(Genre).filter(Genre.id == genre_id).first()
    
    if db_genre:
        db_genre.name = genre.name
        db.commit()
        db.refresh(db_genre)

    return db_genre

def delete_genre(db: Session, genre_id: int):
    
    db_genre = db.query(Genre).filter(Genre.id == genre_id).first()

    if db_genre:
        db.delete(db_genre)
        db.commit()

    return db_genre
