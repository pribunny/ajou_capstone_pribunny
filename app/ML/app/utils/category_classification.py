from pymilvus import connections, Collection
from typing import List
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import os

class TextBatch(BaseModel):
    texts: List[str]

model = SentenceTransformer("jhgan/ko-sbert-sts")

milvus_host = os.getenv("MILVUS_HOST", "localhost")
milvus_port = os.getenv("MILVUS_PORT", "19530")

connections.connect(alias="default", host=milvus_host, port=milvus_port)
collection = Collection("category_embeddings")
collection.load()

def get_category_classify(contexts: TextBatch):
    embeddings = model.encode(contexts.texts, convert_to_tensor = False)

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