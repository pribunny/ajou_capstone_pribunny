from pathlib import Path
from dotenv import load_dotenv
import asyncio
import os
from pymilvus import connections

env_path = Path(__file__).resolve().parent / "../../.env.dev"
load_dotenv(dotenv_path=env_path)

milvus_host = os.getenv("MILVUS_HOST")
milvus_port = os.getenv("MILVUS_PORT")

print(f"milvus: {milvus_host}:{milvus_port}")

connections.connect(
    alias="default",
    host=milvus_host,  # 또는 EC2 IP / 도메인
    port=milvus_port
)
print("Milvus 연결됨")

from app.models.summarizer import SummaryChain
from app.models.base_rag import BaseRAGChain
from app.prompts.prompt_selector import get_detect_prompt, get_summary_detect

# 탐지
cat = 'processingPurpose' # 카테고리 지정하기
query = '내용 입력' # 탐지할 문단 내용 입력

prompt = get_detect_prompt(cat)
detect_chain = BaseRAGChain(prompt=prompt)
print("로딩 시작")
detect_result = asyncio.run(detect_chain.run_async(query=query))

print(detect_result)
print(detect_result.content)

# 요약
cat = 'processingPurpose' # 카테고리 지정하기
query = '내용 입력'

prompt = get_summary_detect(cat)
summary_chain = SummaryChain(prompt=prompt)
summary_result = asyncio.run(summary_chain.run_async(input_text=query, category=cat))

print(summary_result)
print(summary_result.content)

