from langchain_core.runnables import Runnable
from langchain_core.prompts import PromptTemplate
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStoreRetriever
from typing import List, Union

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# 환경변수에서 OpenAI API 키 로드
load_dotenv('./.env.dev')
api_key = os.getenv("OPENAI_API_KEY")

# 🔹 기본 LLM 생성 함수
def get_default_llm() -> BaseChatModel:
    return ChatOpenAI(
        model="gpt-4o-2024-08-06",
        api_key=api_key,
        temperature=0.2
    )

class BaseRAGChain:
    def __init__(
            self,
            retriever: VectorStoreRetriever,
            prompt: PromptTemplate,
            llm: BaseChatModel,
            return_source_documents_type: True,
            chain_type: str = "stuff"
    ):
        self.retriever = retriever
        self.prompt = prompt
        self.llm = llm
        self.chain_type = chain_type
        self._build_chain()
        self.return_source_documents_type = return_source_documents_type

    def _build_chain(self):
        from langchain.chains import RetrievalQA

        self.chain: Runnable = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.retriever,
            chain_type=self.chain_type,
            chain_type_kwargs={"prompt": self.prompt},
            return_source_documents=self.return_source_documents_type
        )

    def run(self, query_or_document: Union[str, dict]) -> str:
        if isinstance(query_or_document, str):
            return self.chain.run(query_or_document)
        elif isinstance(query_or_document, dict) and "query" in query_or_document:
            return self.chain.run(query_or_document["query"])
        else:
            raise ValueError("지원하지 않는 입력 형식입니다.")
