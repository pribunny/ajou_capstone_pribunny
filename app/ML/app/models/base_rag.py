from langchain_core.runnables import Runnable
from langchain_core.prompts import PromptTemplate

from app.retrievers.milvus import get_milvus_retriever
from app.models.llm import get_default_llm

class BaseRAGChain:
    def __init__(
            self,
            prompt: PromptTemplate,
            return_source_documents_type: bool = True,
            chain_type: str = "stuff"
    ):
        self.retriever = get_milvus_retriever()
        self.prompt = prompt
        self.llm = get_default_llm()
        self.chain_type = chain_type
        self.return_source_documents_type = return_source_documents_type
        self._build_chain()

    def _build_chain(self):
        from langchain.chains import RetrievalQA

        self.chain: Runnable = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.retriever,
            chain_type=self.chain_type,
            chain_type_kwargs={"prompt": self.prompt},
            return_source_documents=self.return_source_documents_type
        )

    async def run_async(self, query: str) -> str:
        return await self.chain.ainvoke({"query": query})

