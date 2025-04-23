from http.client import HTTPException
from pydantic import BaseModel

from fastapi import APIRouter
from app.models.summarizer import summary_clause
summary = APIRouter(prefix='/summary')

class SummaryRequest(BaseModel):
    text: str

class SummaryResponse(BaseModel):
    result: str

@summary.post('/', tags=['summary'])
async def summarize_privacy_policy(request: SummaryRequest):
    try:
        result = summary_clause(request.text)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

