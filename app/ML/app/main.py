from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / "../.env.dev"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from app.routes.summary import summary
from app.routes.detect import detect
import os

app = FastAPI()

app.include_router(summary)
app.include_router(detect)

@app.get("/")
async def root():
    return {"message": "Hello, World"}