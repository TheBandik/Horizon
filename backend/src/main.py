from fastapi import FastAPI

from src.routers import media
from src.routers import media_types
from src.routers import users

app = FastAPI()

app.include_router(media.router)
app.include_router(media_types.router)
app.include_router(users.router)
