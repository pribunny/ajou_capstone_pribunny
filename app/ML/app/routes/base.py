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


def make_base_response(data: T, message=str, code: str = "SUCESS") -> BaseResponse[T]:
    return BaseResponse(
        data=data,
        success=True,
        code=code,
        message=message,
        responseTime=datetime.utcnow().isoformat()
    )
