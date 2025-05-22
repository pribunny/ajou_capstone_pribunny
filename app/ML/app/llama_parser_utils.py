import os
from pathlib import Path
from dotenv import load_dotenv
from io import BytesIO

from llama_parse import LlamaParse

env_path = Path(__file__).parent.parent / '.env.dev'
load_dotenv(dotenv_path=env_path)


def get_parser():
    api_key = os.environ.get("LLAMA_CLOUD_API_KEY")
    parser = LlamaParse(
        api_key=api_key,
        result_type="markdown",
        num_workers=4,
        verbose=True,
        language="ko",
    )
    return parser


def parse_pdf_bytes_to_md(pdf_bytes: bytes) -> str:
    parser = get_parser()
    try:
        # BytesIO로 감싸서 메모리에서 처리
        file_like = BytesIO(pdf_bytes)

        # llama_parse가 BytesIO도 처리할 수 있어야 작동함
        documents = parser.load_data(file_like)

        # 페이지별 마크다운 병합
        combined_md = "\n".join(doc.text for doc in documents)
        return combined_md

    except Exception as e:
        print(f"[ERROR] Failed to parse PDF bytes")
        print(e)
        raise
