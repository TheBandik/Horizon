from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.schemas.genres import Genre, GenreBase
from src.dependencies import get_db
from src.crud import genres

router = APIRouter()

@router.post('/genres/', response_model=Genre, tags=['Genres'])
def create_genre(genre: GenreBase, db: Session = Depends(get_db)):
    return genres.create_genre(db=db, genre=genre)

@router.get('/genres/', response_model=list[Genre], tags=['Genres'])
def get_genres(db: Session = Depends(get_db)):
    return genres.get_genres(db=db)

@router.get('/genres/{genre_id}', response_model=Genre, tags=['Genres'])
def get_genre(genre_id: int, db: Session = Depends(get_db)):
    db_genre = genres.get_genre(db=db, genre_id=genre_id)
    
    if db_genre is None:
        raise HTTPException(status_code=404, detail='Genre not found')
    
    return db_genre

@router.put('/genres/{genre_id}', response_model=Genre, tags=['Genres'])
def update_genre(genre_id: int, genre: GenreBase, db: Session = Depends(get_db)):
    db_genre = genres.update_genre(db=db, genre_id=genre_id, genre=genre)

    if db_genre is None:
        raise HTTPException(status_code=404, detail='MediaType not found')
    
    return db_genre

@router.delete('/genres/{genre_id}', tags=['Genres'])
def delete_genre(genre_id: int, db: Session = Depends(get_db)):
    db_genre = genres.delete_genre(db=db, genre_id=genre_id)

    if db_genre is None:
        raise HTTPException(status_code=404, detail='MediaType not found')
    
    return db_genre
