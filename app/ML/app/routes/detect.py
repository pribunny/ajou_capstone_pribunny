import asyncio
from pydantic import BaseModel
from typing import List, TypeVar, Dict, Any
from collections import defaultdict
from fastapi import APIRouter, HTTPException

from app.routes.base import BaseResponse, make_base_response
from app.utils.category_classification import TextBatch, get_category_classify
from app.utils.json_parser import extract_json_from_response
from app.utils.logger import logger
from app.models.base_rag import BaseRAGChain
from app.prompts.prompt_selector import get_detect_prompt

detect = APIRouter(prefix='/llm/unfairDetects')

T = TypeVar("T")

class DetectRequest(BaseModel):
    documentId: str
    contexts: List[str]

class DetectItem(BaseModel):
    category: str
    context: List[str]
    detectItems: Dict[str, Any]

class DetectData(BaseModel):
    documentId: str
    results: List[DetectItem]

@detect.post('/', response_model=BaseResponse[DetectData])
async def detect_unfair_clause(request: DetectRequest):
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

        async def detect_paragraph(cat: str, paragraphs: list[str]) -> DetectItem:
            try:
                prompt = get_detect_prompt(cat)
                merged_context = "\n\n".join(paragraphs)
                detect_chain = BaseRAGChain(prompt=prompt)
                llm_result = await detect_chain.run_async(query=merged_context)

                print("결과: ", llm_result.content)
                items = extract_json_from_response(llm_result.content)

                return DetectItem(
                    category=cat,
                    context=paragraphs,
                    detectItems=items
                )

            except Exception as e:
                print(f"LLM detect 실패 (카테고리: {cat}) → {type(e).__name__}: {e}")
                raise e

        logger.info(f"탐지 실행 id: {doc_id}")

        tasks = [
            detect_paragraph(cat, paras)
            for cat, paras in category_to_contexts.items()
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        detect_data = DetectData(
            documentId=doc_id,
            results=results
        )

        return make_base_response(
            data=detect_data,
            message="탐지 성공"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))