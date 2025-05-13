# rag/retriever.py
from langchain.vectorstores import Milvus
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_core.vectorstores import VectorStoreRetriever

def get_ko_sbert_retriever(collection_name: str = "legal_documents_lib") -> VectorStoreRetriever:
    embedding_model = HuggingFaceEmbeddings(
        model_name="klue/bert-base",  # 혹은 사용자 임베딩 모델
        model_kwargs={"device": "cuda"}
    )
    vectorstore = Milvus(
        embedding_function=embedding_model,
        collection_name=collection_name,
        connection_args={"host": "localhost", "port": "19530"},
        search_params={"metric_type": "L2", "params": {"nprobe": 10}}
    )
    return vectorstore.as_retriever(search_kwargs={"k": 3})