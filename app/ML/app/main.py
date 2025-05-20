from pathlib import Path
from dotenv import load_dotenv
import os

# 로컬에서만 .env 불러오기
if os.getenv("RUN_ENV") != "production":
    env_path = Path(__file__).resolve().parent / "../.env.dev"
    load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from app.routes.summary import summary
from app.routes.detect import detect

app = FastAPI()

app.include_router(summary)
app.include_router(detect)

@app.get("/")
async def root():
    return {"message": "Hello, World"}