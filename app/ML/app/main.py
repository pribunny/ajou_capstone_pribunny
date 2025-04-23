from fastapi import FastAPI
from pathlib import Path
from dotenv import load_dotenv

from app.routes.summary import summary

app = FastAPI()

app.include_router(summary)

env_path = Path(__file__).resolve().parent / "../.env.dev"
load_dotenv(dotenv_path=env_path)

@app.get("/")
async def root():
    return {"message": "Hello, World"}