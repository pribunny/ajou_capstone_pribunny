from pymilvus import Collection, connections

from app.utils.get_embedding import get_embeddings

def search_context(query):
    query_vector = get_embeddings(query)

    law_client = Collection(name="legal_documents_lib")
    # guideline_client = Collection(name="guideline_documents_lib")
    # case_client = Collection(name="case_documents_lib")

    result = law_client.search(
        data=[query_vector],
        anns_field="vector",
        param={"metric_type": "L2", "params": {"nprobe": 10}},
        output_fields=["text", "law_name", "chapter", "section", "clause_title"],
        limit=5
    )

    hits = []
    for re in result[0]:
        # print(re)
        res = (
            f"[ {re.entity.law_name}, {re.entity.chapter}, {re.entity.section}, {re.entity.clause_title} ]\n"
            f"{re.entity.text}"
        )
        hits.append(res)

    context = "\n".join([hit for hit in hits])

    return context
#
# connections.connect(
#     alias="default",
#     host="localhost",
#     port=19530
# )
#
# context = search_context(
#     '''
#     '''
# )
# print(context)