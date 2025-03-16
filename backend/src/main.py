from fastapi import FastAPI

from src.routers import media
from src.routers import media_types

app = FastAPI()

app.include_router(media.router)
app.include_router(media_types.router)
