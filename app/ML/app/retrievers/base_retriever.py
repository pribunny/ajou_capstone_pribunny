from langchain_core.documents import Document
from langchain.vectorstores.base import VectorStoreRetriever
from typing import List, Optional

from app.ML.app.data.chromaDB_client import get_vectorstore
vectorStore = get_vectorstore(collection_name="test")

class BaseRetriever:
    def __init__(
            self,
            vectorstore: VectorStoreRetriever,
            metadata_filter: Optional[dict] = None,
            k: int = 4
    ):
        self.vectorstore = vectorstore
        self.metadata_filter = metadata_filter or {}
        self.k = k

    def get_relevant_documents(self, query: str) -> list[Document]:
        return self.vectorstore.similarity_search(
            query=query,
            k=self.k,
            filter=self.metadata_filter
        )

    async def aget_relevant_documents(self, query: str) -> list[Document]:
        return await self.vectorstore.asimilarity_search(
            query=query,
            k=self.k,
            filter=self.metadata_filter
        )
