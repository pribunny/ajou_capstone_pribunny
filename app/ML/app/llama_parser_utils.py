import os
from pathlib import Path
from dotenv import load_dotenv

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


def parse_pdf_to_md(input_pdf_path, output_md_path):
    parser = get_parser()
    try:
        # 페이지별로 분리된 문서 리스트 로드 (각 문서가 페이지 1개)
        documents = parser.load_data(input_pdf_path)

        page_markdowns = []
        for i, doc in enumerate(documents):
            # 각 페이지별 마크다운 텍스트
            page_md = doc.text
            page_markdowns.append(page_md)

        # 모든 페이지 마크다운 합치기
        combined_md = "\n".join(page_markdowns)

        with open(output_md_path, "w", encoding="utf-8") as f:
            f.write(combined_md)

        print(f"[INFO] Saved combined markdown: {output_md_path}")

    except Exception as e:
        print(f"[ERROR] Failed to parse {input_pdf_path}")
        print(e)


if __name__ == "__main__":
    input_pdf_path = "sample.pdf"
    output_md_path = "sample.md"
    parse_pdf_to_md(input_pdf_path, output_md_path)
