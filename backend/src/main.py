from fastapi import FastAPI

from backend.src.routers import media
from backend.src.routers import media_types
from backend.src.routers import users
from backend.src.routers import series
from backend.src.routers import genres
from backend.src.routers import roles
from backend.src.routers import participants
from backend.src.routers import media_participant_role
from backend.src.routers import statuses
from backend.src.routers import media_user

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
app.include_router(statuses.router)
app.include_router(media_user.router)
