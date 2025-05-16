from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection

# Milvus 연결
connections.connect(alias="default", host="localhost", port="19530")

# 필드 정의
fields = [
    FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=64, is_primary=True, auto_id=False),
    FieldSchema(name="description", dtype=DataType.VARCHAR, max_length=512),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768),
]

schema = CollectionSchema(fields, description="Category description embeddings")
collection = Collection(name="category_embeddings", schema=schema)
collection.create_index(field_name="embedding", index_params={
    "index_type": "IVF_FLAT", "metric_type": "COSINE", "params": {"nlist": 128}
})

collection.load()