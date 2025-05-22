import asyncio
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from typing import List, TypeVar, Dict, Any
from collections import defaultdict

from app.prompts.prompt_selector import get_summary_detect
from app.utils.logger import logger
from app.models.summarizer import SummaryChain
from app.routes.base import BaseResponse, make_base_response
from app.utils.category_classification import get_category_classify, TextBatch
from app.utils.json_parser import extract_json_from_response

summary = APIRouter(prefix='/llm/summaries')

T = TypeVar("T")

class SummaryRequest(BaseModel):
    documentId: str
    contexts: List[str]

class SummaryItem(BaseModel):
    category: str
    context: List[str]
    summaryItems: List[Dict[str, Any]]

class SummaryData(BaseModel):
    documentId: str
    results: List[SummaryItem]

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
            prompt = get_summary_detect(cat)
            merged_context = "\n\n".join(paragraphs)
            summary_chain = SummaryChain(prompt=prompt)
            llm_result = await summary_chain.run_async(input_text=merged_context, category=cat)
            print(llm_result.content)
            items = extract_json_from_response(llm_result.content)
            print("\n\n")

            return SummaryItem(
                category=cat,
                context=paragraphs,
                summaryItems=items
            )

        logger.info(f"요약 실행 id: {doc_id}")

        tasks = [
            summarize_paragraph(cat, paras)
            for cat, paras in category_to_contexts.items()
        ]

        results = []
        for cat, paras in category_to_contexts.items():
            result = await summarize_paragraph(cat, paras)
            results.append(result)

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
        logger.error(f"[SUMMARY ERROR] {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

