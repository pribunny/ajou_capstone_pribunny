import os
from itertools import cycle
from typing import Iterator

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI

# 하나의 API 키만 불러오기
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")

api_keys = [key.strip() for key in api_key.split(",") if key.strip()]
if not api_keys:
    raise ValueError("API 키가 유효하지 않습니다.")

# 순환 가능한 API 키 이터레이터 생성
api_key_cycle: Iterator[str] = cycle(api_keys)

def get_default_llm() -> BaseChatModel:
    api_key = next(api_key_cycle)
    print(f"[DEBUG] 사용 중인 API 키: {api_key[:20]}...")
    return ChatOpenAI(
        model="gpt-4.1",
        api_key=api_key,
        temperature=0.2
    )
