from datetime import date
from typing import Optional
import json

from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session

from backend.src.aws import S3
from backend.src.exceptions import NotFoundError
from backend.src.schemas.media import MediaBase, MediaSearch
from backend.src.dependencies import get_db, get_s3
from backend.src.crud.media import create_media, get_media, media_search

router = APIRouter()


@router.post("/media/", tags=["Media"])
def create_media_endpoint(
        title: str = Form(...),
        original_title: Optional[str] = Form(None),
        description: Optional[str] = Form(None),
        poster: Optional[UploadFile] = File(None),
        release_date: Optional[str] = Form(None),
        media_type_id: str = Form(...),
        genre_ids: str = Form("[]"),
        participant_ids: str = Form("[]"),
        series_ids: str = Form("[]"),
        db: Session = Depends(get_db),
        s3: S3 = Depends(get_s3)
):
    s3_poster = s3.upload_file(poster)

    media = MediaBase(
        title=title,
        original_title=original_title,
        description=description,
        poster=s3_poster,
        release_date=release_date,
        media_type_id=int(media_type_id),
        genre_ids=json.loads(genre_ids),
        participant_ids=json.loads(participant_ids),
        series_ids=json.loads(series_ids)
    )

    return create_media(db=db, media=media)


@router.get("/media/{media_id}", tags=["Media"])
def get_media_endpoint(media_id: int, db: Session = Depends(get_db)):
    try:
        return get_media(media_id=media_id, db=db)

    except NotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/media/search/", response_model=list[MediaSearch], tags=["Media"])
def media_search_endpoint(title: str, db: Session = Depends(get_db)):
    try:
        return media_search(title=title, db=db)

    except Exception as error:
        print(error)
