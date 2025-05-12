from docutils.nodes import status
from pydantic import BaseModel
from fastapi import HTTPException
from app.routes.base import BaseRequest, BaseResponse
from app.routes.summary import extract_json_from_response
from app.utils.logger import logger
import shortuuid

from fastapi import APIRouter
from app.models.detecter import DetectChain

detect = APIRouter(prefix='/llm/unfairDetects')

class DetectRequest(BaseModel):
    inputContext: str

class DetectResponse(BaseModel):
    text: str

@detect.post('/', response_model=BaseResponse[DetectResponse])
async def detect_unfair_clause(request: DetectRequest):
    try:
        item_id = shortuuid.uuid()
        logger.info(f"요약 실행 id: {item_id}")
        detect_chain=DetectChain()
        output = detect_chain.run(request.inputContext)

        return DetectResponse(
            text=output
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

