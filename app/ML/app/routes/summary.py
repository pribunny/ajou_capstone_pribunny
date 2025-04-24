from datetime import datetime
from http.client import HTTPException
from pydantic import BaseModel
from typing import List
from app.utils.logger import logger
from fastapi import APIRouter
from app.models.summarizer import summary_clause
from app.routes.base import BaseRequest, BaseResponse
import shortuuid

import json
import re

summary = APIRouter(prefix='/llm/summaries')

class SummaryItem(BaseModel):
    category_name: str
    summarize_content: str

class SummaryRequest(BaseModel):
    inputContext: str

class SummaryResponse(BaseModel):
    summaryId: str
    summaryItems: List[SummaryItem]

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

@summary.post('/', response_model=BaseResponse[SummaryResponse])
async def summarize_privacy_policy(request: SummaryRequest):
    try:
        item_id = shortuuid.uuid()
        logger.info(f"요약 실행 id: {item_id}")
        llm_output = summary_clause(request.inputContext)
        
        # json 파싱
        items = extract_json_from_response(llm_output.content)

        return BaseResponse(
            success=True,
            code="SUCCESS",
            message="요약 결과 생성에 성공했습니다.",
            responseTime=datetime.now(),
            data=SummaryResponse(
                summaryId=item_id,
                summaryItems=[SummaryItem(**item) for item in items]
            )
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

