from fastapi import FastAPI

from src.routers import media

app = FastAPI()

app.include_router(media.router)
