from docutils.nodes import status
from pydantic import BaseModel
from fastapi import HTTPException
from app.routes.base import BaseRequest, BaseResponse, make_base_response
from app.routes.summary import extract_json_from_response
from app.utils.logger import logger
import shortuuid

from fastapi import APIRouter
from app.models.base_rag import BaseRAGChain
from app.retrievers.milvus import get_milvus_retriever
from app.prompts.unfair_clause_prompt import unfair_detect_template

detect = APIRouter(prefix='/llm/unfairDetects')

class DetectRequest(BaseModel):
    inputContext: str

class DetectResponse(BaseModel):
    text: str

@detect.post('/', response_model=BaseResponse[DetectResponse])
async def detect_unfair_clause(request: DetectRequest):
    try:
        item_id = shortuuid.uuid()
        logger.info(f"탐지 실행 id: {item_id}")
        retriever = get_milvus_retriever()
        detect_chain=BaseRAGChain(retriever, unfair_detect_template)
        output = detect_chain.run(request.inputContext)
        print("DEBUG output:", output)

        return make_base_response(
            data=DetectResponse(text=output["result"]),
            message="탐지 성공"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

