# from fastapi import APIRouter, Request, HTTPException
# from fastapi.responses import JSONResponse
# import os
# import pdfplumber
# from PIL import Image
# import pytesseract

# router = APIRouter()

# @router.post("/extract-text-by-path")
# async def extract_text_by_path(request: Request):
#     data = await request.json()
#     file_path = data.get('filePath')

#     if not file_path or not os.path.exists(file_path):
#         raise HTTPException(status_code=400, detail='파일 경로가 없거나 유효하지 않습니다.')

#     ext = os.path.splitext(file_path)[1].lower()

#     try:
#         if ext == '.pdf':
#             with pdfplumber.open(file_path) as pdf:
#                 full_text = []
#                 all_tables = []

#                 for page_num, page in enumerate(pdf.pages, start=1):
#                     text = page.extract_text()
#                     if text:
#                         full_text.append(f"--- 페이지 {page_num} ---\n{text}")

#                     tables = page.extract_tables()
#                     for table in tables:
#                         all_tables.append(table)

#             return {
#                 'success': True,
#                 'text': "\n\n".join(full_text),
#                 'tables': all_tables
#             }

#         elif ext in ['.jpg', '.jpeg', '.png', '.bmp']:
#             image = Image.open(file_path)
#             text = pytesseract.image_to_string(image)

#             return {
#                 'success': True,
#                 'text': text,
#                 'tables': []  # 이미지에서 표 추출은 별도 처리 필요
#             }
#         else:
#             raise HTTPException(status_code=400, detail='지원하지 않는 파일 형식입니다.')

#     except Exception as e:
#         return JSONResponse(status_code=500, content={'error': f'텍스트 추출 중 오류 발생: {str(e)}'})

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from app.llama_parser_utils import parse_pdf_to_md  # 새로 만든 함수 import
import tempfile

router = APIRouter()


class FilePathRequest(BaseModel):
    filePath: str


@router.post("/extract-text")
async def extract_text_by_path(payload: FilePathRequest):
    file_path = payload.filePath

    if not os.path.exists(file_path):
        raise HTTPException(status_code=400, detail='파일 경로가 없거나 유효하지 않습니다.')

    ext = os.path.splitext(file_path)[1].lower()

    if ext != '.pdf':
        raise HTTPException(status_code=400, detail='지원하지 않는 파일 형식입니다. (현재 PDF만 지원)')

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            output_md_path = os.path.join(tmpdir, "result.md")

            # 함수 호출 시 에러 발생 가능하니 try-except로 감싸기
            parse_pdf_to_md(file_path, output_md_path)

            with open(output_md_path, "r", encoding="utf-8") as f:
                text = f.read()

            return {
                'success': True,
                'text': text
            }

    except Exception as e:
        # 에러 메시지를 로그에 자세히 남기고 클라이언트에 알리기
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f'텍스트 추출 중 오류 발생: {str(e)}')
