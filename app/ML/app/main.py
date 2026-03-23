from pathlib import Path
from dotenv import load_dotenv
import os

# 로컬에서만 .env 불러오기
if os.getenv("RUN_ENV") != "production":
    env_path = Path(__file__).resolve().parent / "../.env.dev"
    load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from contextlib import asynccontextmanager
from pymilvus import connections
from app.routes.summary import summary
from app.routes.detect import detect

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 앱 시작 시 실행 (Milvus 연결)

    milvus_host = os.getenv("MILVUS_HOST")
    milvus_port = os.getenv("MILVUS_PORT")

    print(f"milvus: {milvus_host}:{milvus_port}")

    connections.connect(
        alias="default",
        host=milvus_host,  # 또는 EC2 IP / 도메인
        port=milvus_port
    )
    print("Milvus 연결됨")
    yield
    # 앱 종료 시 실행
    connections.disconnect(alias="default")
    print("Milvus 연결 종료됨")

app = FastAPI(lifespan=lifespan)

app.include_router(summary)
app.include_router(detect)

@app.get("/")
async def root():
    return {"message": "Hello, World"}