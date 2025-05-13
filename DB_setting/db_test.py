from pymilvus import connections, Collection

# Milvus 서버에 연결
connections.connect(
    alias="default",
    host="localhost",  # 또는 도커를 쓰는 경우 host.docker.internal
    port="19530"
)

# 연결된 후 Collection 사용
collection = Collection("legal_documents_lib")

collection.create_index(
    field_name="embedding",
    index_params={
        "index_type": "IVF_FLAT",
        "metric_type": "L2",
        "params": {"nlist": 128}
    }
)

collection.load()

results = collection.query(
    expr="law_name == '개인정보 보호법'",
    output_fields=["chapter", "clause_title", "content"],
    limit=100
)

# 예시: 엔티티 수 확인
print("총 문서 수:", collection.num_entities)

for r in results:
    print(r)