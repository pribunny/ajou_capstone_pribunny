'''
RAG document embedding DB
'''
import os.path
from logging import raiseExceptions

import torch
import pandas as pd
import numpy as np
from tqdm import tqdm

from transformers import AutoTokenizer, AutoModel
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

MODEL = 'klue/bert-base'
COLLECTION_NAME = 'legal_documents_lib'
DIMENSION = 768
LIMIT = 10
MILVUS_HOST = 'localhost'
MILVUS_PORT = '19530'
INDEX_TYPE = 'IVF_FLAT' # 인덱스 알고리즘

connections.connect(host=MILVUS_HOST, port=MILVUS_PORT)

if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# 2. Define Fields
fields = [
    FieldSchema(name="id", dtype=DataType.VARCHAR, is_primary=True, auto_id=True, max_length=16),
    FieldSchema(name="type", dtype=DataType.VARCHAR, max_length=16),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=60000),
    FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=DIMENSION),

    # Optional - LAW
    FieldSchema(name="law_name", dtype=DataType.VARCHAR, max_length=128),
    FieldSchema(name="chapter", dtype=DataType.VARCHAR, max_length=128),
    FieldSchema(name="section", dtype=DataType.VARCHAR, max_length=128),
    FieldSchema(name="clause_title", dtype=DataType.VARCHAR, max_length=256),

    # Optional - GUIDELINE
    FieldSchema(name="guideline_name", dtype=DataType.VARCHAR, max_length=128),
    FieldSchema(name="publisher", dtype=DataType.VARCHAR, max_length=64),
    FieldSchema(name="version", dtype=DataType.VARCHAR, max_length=16),
    FieldSchema(name="section_title", dtype=DataType.VARCHAR, max_length=256),

    # Optional - CASE
    FieldSchema(name="case_number", dtype=DataType.VARCHAR, max_length=64),
    FieldSchema(name="court", dtype=DataType.VARCHAR, max_length=32),
    FieldSchema(name="judgment_date", dtype=DataType.VARCHAR, max_length=32),
    FieldSchema(name="case_title", dtype=DataType.VARCHAR, max_length=128),
    FieldSchema(name="issue_summary", dtype=DataType.VARCHAR, max_length=1024),
    FieldSchema(name="judgment_summary", dtype=DataType.VARCHAR, max_length=1024),
    FieldSchema(name="referenced_laws", dtype=DataType.VARCHAR, max_length=1024)
]

schema = CollectionSchema(fields=fields)
collection = Collection(name=COLLECTION_NAME, schema=schema)

if collection.has_index():
    try:
        collection.drop_index()
    except:
        collection.release()
        collection.drop_index()

index_params = {
    'metric_type': 'L2',
    'index_type': INDEX_TYPE,
    'params': {"nlist": 1}
}
collection.create_index(field_name="vector", index_params=index_params)
collection.load()

# 데이터 로드
df = pd.read_csv("legal_documents_metadata.csv", encoding="utf-8")
embeddings = np.load("legal_documents_embeddings.npy")

print(df["clause_title"])
df = df.fillna("")  # 모든 NaN을 빈 문자열로 바꿔줌

# Milvus insert 준비
data = [
    df["type"].tolist(),
    df["content"].tolist(),
    embeddings.tolist(),
    df["law_name"].tolist(),
    df["chapter"].tolist(),
    df["section"].tolist(),
    df["clause_title"].tolist(),
    df["guideline_name"].tolist(),
    df["publisher"].tolist(),
    df["version"].tolist(),
    df["section_title"].tolist(),
    df["case_number"].tolist(),
    df["court"].tolist(),
    df["judgment_date"].tolist(),
    df["case_title"].tolist(),
    df["issue_summary"].tolist(),
    df["judgment_summary"].tolist(),
    df["referenced_laws"].tolist()
]

collection.insert(data)
collection.flush()
print("✅ Milvus insert 완료")
