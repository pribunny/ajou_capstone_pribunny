from langchain_core.runnables import Runnable, RunnableSequence
from langchain_core.prompts import PromptTemplate
from app.prompts.summariz_prompt import summary_template
from app.models.base_rag import get_default_llm
from app.utils.logger import logger


class SummaryChain:
    def __init__(
            self,
            prompt: PromptTemplate
    ):
        self.llm = get_default_llm()
        self.prompt=prompt
        self._build_chain()

    def _build_chain(self):
        self.chain: Runnable = self.prompt | self.llm

    async def run_async(self, input_text: str):
        return await self.chain.ainvoke({"full_clause": input_text})