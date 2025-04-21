import os
from dotenv import load_dotenv

from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from base_retriever import BaseRetriever

# 단락에서 keyword 뽑기, 모델은 동일 모델 이용
summary_prompt = PromptTemplate.from_template("""
너는 개인정보 처리방침 문서를 분석하는 법률 전문가야.
아래의 단락에서 핵심 주제를 한 문장으로 요약하고, 
그 문장을 기반으로 법률적으로 의미 있는 대표 키워드 5개를 뽑아줘.
요약한 내용은 출력하지 않아도 돼. 아래 답변 형식에 맞춰서 키워드만 출력해줘.

[답변 형식]
keyword1 keyword2
- 위와 같이 키워드는 공백으로 구분

[단락]
{query}
""")

# 환경변수에서 OpenAI API 키 로드
load_dotenv('../.env')
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)

# 🔹 키워드 추출 함수
def extract_keywords(llm: ChatOpenAI, query: str) -> list[str]:
    chain = summary_prompt | llm
    result = chain.invoke({"query": query})
    for line in result.content.splitlines():
        if line.strip() and not line.startswith("["):
            return line.strip().split()
    return []

# 🔹 메타데이터 필터 빌더
def build_metadata_filter(keywords: list[str]) -> dict:
    fields = ["clause", "chapter", "section", "clause_name"]
    return {
        "$or": [{field: {"$in": keywords}} for field in fields]
    }

# 🔹 최종 Retriever 반환 함수
def get_unfair_clause_retriever(query: str, collection_name: str = "test", k: int = 5):
    llm = ChatOpenAI(
        model="gpt-4o-2024-08-06",
        api_key=api_key,
        temperature=0.2,
    )

    keywords = extract_keywords(llm, query)
    filter_query = build_metadata_filter(keywords)

    return BaseRetriever(
        metadata_filter=filter_query,
        k=k
    )