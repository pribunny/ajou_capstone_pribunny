import os

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI
from itertools import cycle

# 여러 개의 API 키 리스트
def load_api_keys() -> list[str]:
    keys_str = os.getenv("OPENAI_API_KEY")
    if not keys_str:
        raise ValueError("OPENAI_API_KEYS 환경변수가 설정되지 않았습니다.")
    return [key.strip() for key in keys_str.split(",") if key.strip()]

api_keys = load_api_keys()
api_key_iterator = cycle(api_keys)  # 무한 순환

def get_default_llm() -> BaseChatModel:
    key = next(api_key_iterator)
    print(f"[LLM 생성] 사용하는 API Key: {key[:10]}...")
    return ChatOpenAI(
        model="gpt-4.1-nano",
        api_key=key,
        temperature=0.2
    )