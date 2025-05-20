from pymilvus import Collection, connections

from app.utils.get_embedding import get_embeddings

connections.connect(
    alias="default",
    host="localhost",  # 또는 EC2 내부 IP / 도메인
    port="19530"
)

def search_context(query):
    query_vector = get_embeddings(query)

    milvus_client = Collection(name="legal_documents_lib")
    result = milvus_client.search(
        data=[query_vector],
        anns_field="vector",
        param={"metric_type": "L2", "params": {"nprobe": 10}},
        output_fields=["text", "law_name", "chapter", "section", "clause_title"],
        limit=5
    )

    hits = []
    for re in result[0]:
        # print(f"조항: {re.entity.law_name}, {re.entity.chapter}, {re.entity.section}, {re.entity.clause_title}")
        # print(re.entity.text)
        res = (
            f"[ {re.entity.law_name}, {re.entity.chapter}, {re.entity.section}, {re.entity.clause_title} ]\n"
            f"{re.entity.text}"
        )
        print(res)
        hits.append(res)

    context = "\n".join([hit for hit in hits])

    return context