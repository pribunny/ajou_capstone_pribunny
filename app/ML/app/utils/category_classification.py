from pymilvus import connections, Collection
from typing import List
from pydantic import BaseModel
import os

from app.utils.get_embedding import get_embeddings

class TextBatch(BaseModel):
    texts: List[str]

milvus_host = os.getenv("MILVUS_HOST", "localhost")
milvus_port = os.getenv("MILVUS_PORT", "19530")

def get_category_classify(contexts: TextBatch):
    embeddings = get_embeddings(contexts.texts)

    collection = Collection("category_embeddings")

    results = []
    search_results = collection.search(
        data=embeddings,
        anns_field="embedding",
        param={"metric_type": "L2", "params": {"nprobe": 10}},
        limit=1,
        output_fields=["category", "description"]
    )

    output = []
    for hits in search_results:
        if hits:
            top = hits[0]
            output.append({
                "matched_category": top.entity.get("category"),
                "score": top.distance
            })
        else:
            output.append({
                "matched_category": "unknown",
                "score": 0.0
            })

    return {"results": output}