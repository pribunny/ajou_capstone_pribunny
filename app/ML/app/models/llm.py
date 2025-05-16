import os

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_openai import ChatOpenAI

api_key = os.getenv("OPENAI_API_KEY")

# 🔹 기본 LLM 생성 함수
def get_default_llm() -> BaseChatModel:
    return ChatOpenAI(
        model="gpt-4o-2024-08-06",
        api_key=api_key,
        temperature=0.2
    )