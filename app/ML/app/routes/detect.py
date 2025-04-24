from pydantic import BaseModel
from http.client import HTTPException
from app.routes.base import BaseRequest, BaseResponse

from fastapi import APIRouter
from app.models.summarizer import summary_clause

detect = APIRouter(prefix='/llm/unfairDetects')

class DetectRequest(BaseModel):
    text : str

class DetectResponse(BaseModel):
    text: str

def get_detect_response(text: str):
    return


