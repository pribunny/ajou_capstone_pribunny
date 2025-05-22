import boto3
from io import BytesIO
from llama_parse import LlamaParse
import os
from dotenv import load_dotenv
import sys

load_dotenv()  # .env 파일에서 환경변수 읽기

def get_s3_client():
    return boto3.client(
        's3',
        region_name=os.environ.get('AWS_REGION'),
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    )

def download_s3_file(bucket_name, key) -> bytes:
    s3 = get_s3_client()
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    return obj['Body'].read()

def get_parser():
    return LlamaParse(
        api_key=os.environ.get("LLAMA_CLOUD_API_KEY"),
        result_type="markdown",
        num_workers=4,
        verbose=False,
        language="ko"
    )

def parse_pdf_from_s3(bucket, key):
    pdf_bytes = download_s3_file(bucket, key)
    parser = get_parser()
    file_like = BytesIO(pdf_bytes)
    extra_info = {"file_name": key}
    documents = parser.load_data(file_like, extra_info=extra_info)
    return "\n".join(doc.text for doc in documents)

if __name__ == "__main__":
    # S3 버킷 이름이 인자로 안 들어오면 S3_BUCKET_NAME 환경변수에서 읽음
    bucket = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('S3_BUCKET_NAME')
    key = sys.argv[2] if len(sys.argv) > 2 else None

    if not bucket or not key:
        print("[ERROR] bucket 또는 key가 지정되지 않았습니다.", file=sys.stderr)
        exit(1)

    md = parse_pdf_from_s3(bucket, key)
    print(md)
