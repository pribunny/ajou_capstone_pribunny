import os
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI

# 하나의 API 키만 불러오기
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")

def get_default_llm() -> BaseChatModel:
    return ChatOpenAI(
        model="gpt-4o-mini",
        api_key=api_key,
        temperature=0.2
    )
