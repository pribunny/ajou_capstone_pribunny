import asyncio
from datetime import datetime
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from typing import List, Optional, Generic, TypeVar, Dict, Any
from collections import defaultdict

from app.prompts.prompt_selector import get_prompt_summary
from app.utils.logger import logger
from app.models.summarizer import SummaryChain
from app.routes.base import BaseRequest, BaseResponse, make_base_response
from app.utils.category_classification import get_category_classify, TextBatch

import json
import re

summary = APIRouter(prefix='/llm/summaries')

T = TypeVar("T")

class SummaryRequest(BaseModel):
    documentId: str
    contexts: List[str]

class SummaryResponse(BaseModel, Generic[T]):
    success: bool
    code: str
    message: str
    responseTime: datetime
    data: Optional[T]

class SummaryItem(BaseModel):
    category: str
    context: str
    summaryItems: List[Dict[str, Any]]

class SummaryData(BaseModel):
    documentId: str
    results: List[SummaryItem]

def extract_json_from_response(text: str):
    # 답변 json으로 파싱하기
    try:
        match = re.search(r"```json\n(.+?)\n```", text, re.DOTALL)
        if not match:
            raise ValueError("JSON 블록을 찾을 수 없습니다.")
        json_str = match.group(1)
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 오류: {e}")

@summary.post('/', response_model=BaseResponse[SummaryData])
async def summarize_privacy_policy(request: SummaryRequest):
    try:
        doc_id = request.documentId

        contexts = TextBatch(texts = request.contexts)
        category_mapping = get_category_classify(contexts)

        category_to_contexts = defaultdict(list)
        for i, cat_result in enumerate(category_mapping["results"]):
            print(cat_result)
            category = cat_result["matched_category"]
            print(category)
            paragraph = contexts.texts[i]
            category_to_contexts[category].append(paragraph)

        async def summarize_paragraph(cat: str, paragraphs: list[str]) -> SummaryItem:
            prompt = get_prompt_summary(cat)
            merged_context = "\n\n".join(paragraphs)
            summary_chain = SummaryChain(prompt=prompt)
            llm_result = await summary_chain.run_async(input_text=merged_context)
            items = extract_json_from_response(llm_result.content)

            return SummaryItem(
                category=cat,
                context=merged_context,
                summaryItems=items
            )

        logger.info(f"요약 실행 id: {doc_id}")

        tasks = [
            summarize_paragraph(cat, paras)
            for cat, paras in category_to_contexts.items()
        ]

        results = await asyncio.gather(*tasks)

        summary_data = SummaryData(
            documentId=doc_id,
            results=results
        )

        return make_base_response(
            data=summary_data,
            message="요약에 성공했습니다."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

