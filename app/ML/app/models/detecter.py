from langchain_core.runnables import Runnable, RunnableSequence
from langchain_core.vectorstores import VectorStoreRetriever
from langchain.prompts import PromptTemplate

from app.prompts.unfair_clause_prompt import unfair_detect_template
from app.models.base_rag import get_default_llm
from app.utils.logger import logger


class DetectChain:
    def __init__(
            self,
            retriever: VectorStoreRetriever,
            prompt: PromptTemplate
    ):
        self.llm=get_default_llm()
        self.prompt=prompt
        self.retriever=retriever
        self._build_chain()

    def _build_chain(self):
        from langchain.chains import RetrievalQA

        self.chain: Runnable = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.retriever,
            chain_type="stuff",
            chain_type_kwargs={"prompt": self.prompt},
            return_source_documents=True
        )

    def run(self, input_text):
        return self.chain.invoke({"full_clause": input_text})