# rag/retriever.py
from langchain_milvus import Milvus
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import VectorStoreRetriever
import os
from pymilvus import connections, Collection

milvus_host = os.getenv("MILVUS_HOST", "124.0.3.124")
milvus_port = os.getenv("MILVUS_PORT", "19530")
print("환경변수 디버깅", milvus_host, milvus_port)

def get_milvus_retriever(
        collection_name: str = "legal_documents_lib",
) -> VectorStoreRetriever:
    embedding_model = HuggingFaceEmbeddings(
        model_name="jhgan/ko-sbert-sts",
        model_kwargs={"device": "cpu"}
    )

    # 이전 연결 해제
    connections.disconnect(alias="default")
    print("[DEBUG] 기존 Milvus 연결 해제 완료")

    connections.connect(
        alias="default",
        host=milvus_host,
        port=milvus_port
    )

    vectorstore = Milvus(
        embedding_function=embedding_model,
        collection_name=collection_name,
        connection_args={
            "host": milvus_host,
            "port": milvus_port
        },
        search_params={"metric_type": "L2", "params": {"nprobe": 10}}
    )

    # ✅ 연결된 Milvus 확인
    try:
        col = Collection(collection_name)
        print(f"[DEBUG] Milvus 연결됨 → 컬렉션 '{col.name}' 접근 성공")
        print(milvus_host, milvus_port)
    except Exception as e:
        print(f"[ERROR] Milvus 연결 또는 컬렉션 접근 실패: {e}")

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    return retriever
