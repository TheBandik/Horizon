from fastapi import FastAPI

from src.routers import media
from src.routers import media_types
from src.routers import users
from src.routers import series
from src.routers import genres
from src.routers import roles
from src.routers import participants
from src.routers import media_participant_role


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media.router)
app.include_router(media_types.router)
app.include_router(users.router)
app.include_router(series.router)
app.include_router(genres.router)
app.include_router(roles.router)
app.include_router(participants.router)
app.include_router(media_participant_role.router)
