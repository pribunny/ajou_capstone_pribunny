# filename: model_server.py

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

from utils.chromaDB_client import get_vectorstore
from prompts.prompt_templates import summary_template, unfair_detect_template
from loaders.html_parser import clean_html

# 환경변수 로드
load_dotenv(".env.prod.dev")
api_key = os.getenv("OPENAI_API_KEY")

# FastAPI 앱 초기화
app = FastAPI(title="모델 서빙 API")

# Pydantic 모델
class InferenceRequest(BaseModel):
    html_text: str

# LLM 초기화
llm = ChatOpenAI(model="gpt-4o-2024-08-06", api_key=api_key, temperature=0.2)
vectorstore = get_vectorstore(collection_name="test")


@app.post("/summary")
async def summarize(request: InferenceRequest):
    try:
        clean_text = clean_html(request.html_text)
        prompt_input = summary_template.format(full_clause=clean_text)
        response = llm.invoke(prompt_input)
        return {"summary": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/unfair-detection")
async def detect_unfair_clause(request: InferenceRequest):
    try:
        query = request.html_text
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
            chain_type="stuff",
            chain_type_kwargs={"prompt": unfair_detect_template},
            return_source_documents=True
        )
        response = qa_chain.invoke({"query": query})

        result = {
            "result": response["result"],
            "source_documents": [
                {"content": doc.page_content, "metadata": doc.metadata}
                for doc in response["source_documents"]
            ]
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {"message": "모델 서빙 API 정상 작동 중"}
