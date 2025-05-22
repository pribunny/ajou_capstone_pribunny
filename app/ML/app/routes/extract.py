# # from fastapi import APIRouter, Request, HTTPException
# # from fastapi.responses import JSONResponse
# # import os
# # import pdfplumber
# # from PIL import Image
# # import pytesseract

# # router = APIRouter()

# # @router.post("/extract-text-by-path")
# # async def extract_text_by_path(request: Request):
# #     data = await request.json()
# #     file_path = data.get('filePath')

# #     if not file_path or not os.path.exists(file_path):
# #         raise HTTPException(status_code=400, detail='파일 경로가 없거나 유효하지 않습니다.')

# #     ext = os.path.splitext(file_path)[1].lower()

# #     try:
# #         if ext == '.pdf':
# #             with pdfplumber.open(file_path) as pdf:
# #                 full_text = []
# #                 all_tables = []

# #                 for page_num, page in enumerate(pdf.pages, start=1):
# #                     text = page.extract_text()
# #                     if text:
# #                         full_text.append(f"--- 페이지 {page_num} ---\n{text}")

# #                     tables = page.extract_tables()
# #                     for table in tables:
# #                         all_tables.append(table)

# #             return {
# #                 'success': True,
# #                 'text': "\n\n".join(full_text),
# #                 'tables': all_tables
# #             }

# #         elif ext in ['.jpg', '.jpeg', '.png', '.bmp']:
# #             image = Image.open(file_path)
# #             text = pytesseract.image_to_string(image)

# #             return {
# #                 'success': True,
# #                 'text': text,
# #                 'tables': []  # 이미지에서 표 추출은 별도 처리 필요
# #             }
# #         else:
# #             raise HTTPException(status_code=400, detail='지원하지 않는 파일 형식입니다.')

# #     except Exception as e:
# #         return JSONResponse(status_code=500, content={'error': f'텍스트 추출 중 오류 발생: {str(e)}'})

# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# import os
# from app.llama_parser_utils import parse_pdf_to_md  # 새로 만든 함수 import
# import tempfile

# router = APIRouter()


# class FilePathRequest(BaseModel):
#     filePath: str


# @router.post("/extract-text")
# async def extract_text_by_path(payload: FilePathRequest):
#     file_path = payload.filePath

#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=400, detail='파일 경로가 없거나 유효하지 않습니다.')

#     ext = os.path.splitext(file_path)[1].lower()

#     if ext != '.pdf':
#         raise HTTPException(status_code=400, detail='지원하지 않는 파일 형식입니다.')

#     try:
#         with tempfile.TemporaryDirectory() as tmpdir:
#             output_md_path = os.path.join(tmpdir, "result.md")

#             # 함수 호출 시 에러 발생 가능하니 try-except로 감싸기
#             parse_pdf_to_md(file_path, output_md_path)

#             with open(output_md_path, "r", encoding="utf-8") as f:
#                 text = f.read()

#             return {
#                 'success': True,
#                 'text': text
#             }

#     except Exception as e:
#         # 에러 메시지를 로그에 자세히 남기고 클라이언트에 알리기
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f'텍스트 추출 중 오류 발생: {str(e)}')


import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from botocore.exceptions import ClientError
from app.llama_parser_utils import parse_pdf_bytes_to_md
import boto3
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

router = APIRouter()

s3 = boto3.client(
    "s3",
    region_name=os.environ.get("AWS_REGION"),
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
)

BUCKET_NAME = os.environ.get("AWS_S3_BUCKET_NAME")


class FileNameRequest(BaseModel):
    filename: str  # 클라이언트가 넘겨주는 pdf 파일명


@router.post("/extract-text")
async def extract_text_from_s3(payload: FileNameRequest):
    try:
        # 여기서 파일명만 받아서 S3 키로 사용
        key = payload.filename

        response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        pdf_bytes = response["Body"].read()

        md_text = parse_pdf_bytes_to_md(pdf_bytes)

        return {
            "success": True,
            "text": md_text,
        }

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 에러: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파싱 에러: {str(e)}")
