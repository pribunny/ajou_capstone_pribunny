from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
from datetime import datetime

T = TypeVar("T")

# 공통 Request/Response Base 클래스
class BaseRequest(BaseModel, Generic[T]):
    data: Optional[T]

class BaseResponse(BaseModel, Generic[T]):
    success: bool
    code: str
    message: str
    responseTime: datetime
    data: Optional[T]