# rag/retriever.py
from langchain_milvus import Milvus
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.vectorstores import VectorStoreRetriever
import os

milvus_host = os.getenv("MILVUS_HOST", "localhost")
milvus_port = os.getenv("MILVUS_PORT", "19530")

def get_milvus_retriever(
        collection_name: str = "legal_documents_lib",
) -> VectorStoreRetriever:
    embedding_model = HuggingFaceEmbeddings(
        model_name="jhgan/ko-sbert-sts",
        model_kwargs={"device": "cpu"}
    )

    vectorstore = Milvus(
        embedding_function=embedding_model,
        collection_name=collection_name,
        connection_args={"host": milvus_host, "port": milvus_port},
        search_params={"metric_type": "L2", "params": {"nprobe": 10}}
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    return retriever
