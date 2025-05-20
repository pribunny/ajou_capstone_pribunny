from langchain_core.runnables import Runnable
from langchain_core.prompts import PromptTemplate
from app.models.llm import get_default_llm
from app.retrievers.milvus_retriever import search_context

class BaseRAGChain:
    def __init__(
            self,
            prompt: PromptTemplate,
            return_source_documents_type: bool = True,
            chain_type: str = "stuff"
    ):
        self.prompt = prompt
        self.llm = get_default_llm()
        self._build_chain()

    def _build_chain(self):

        self.chain: Runnable = self.prompt | self.llm
    async def run_async(self, query: str) -> str:

        context = search_context(query) # 문서 검색

        return await self.chain.ainvoke({"query": query, "context": context})

