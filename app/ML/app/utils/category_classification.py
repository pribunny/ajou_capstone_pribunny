from pymilvus import connections, Collection
from typing import List
from pydantic import BaseModel
import os

from app.utils.get_embedding import get_embeddings

class TextBatch(BaseModel):
    texts: List[str]

milvus_host = os.getenv("MILVUS_HOST", "localhost")
milvus_port = os.getenv("MILVUS_PORT", "19530")

THRESHOLD = 0.6

def get_category_classify(contexts: TextBatch):
    embeddings = get_embeddings(contexts.texts)

    collection = Collection("category_embeddings")

    results = []
    search_results = collection.search(
        data=embeddings,
        anns_field="embedding",
        param={"metric_type": "COSINE", "params": {"nprobe": 10}},
        limit=1,
        output_fields=["category", "description"]
    )

    output = []
    for hits in search_results:
        if hits:
            top = hits[0]
            if top.distance >= THRESHOLD:
                output.append({
                    "matched_category": top.entity.get("category"),
                    "score": top.distance
                })
            else:
                output.append({
                    "matched_category": "unknown",
                    "score": top.distance
                })
        else:
            output.append({
                "matched_category": "unknown",
                "score": 0.0
            })

    return {"results": output}

# connections.connect(
#     alias="default",
#     host="milvus-5076c41fa8a85451.elb.ap-northeast-2.amazonaws.com",  # 또는 EC2 IP / 도메인
#     port="19530"
# )
#
# print("Milvus 연결됨")
#
# test_data = TextBatch(texts=[
#     '''
#
#     '''
# ])
#
# result = get_category_classify(test_data)
#
# from pprint import pprint
# pprint(result)
