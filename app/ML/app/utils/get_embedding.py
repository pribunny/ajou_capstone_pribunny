from sentence_transformers import SentenceTransformer
from typing import List

# 모델은 앱 로딩 시 한 번만 로드됨
model = SentenceTransformer("app/utils/ko-sbert-finetuned")
# model = SentenceTransformer("./ko-sbert-finetuned")

def get_embeddings(texts: List[str]) -> List[List[float]]:
    return model.encode(texts, convert_to_tensor=False).tolist()