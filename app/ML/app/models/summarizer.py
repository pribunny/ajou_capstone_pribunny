from langchain_core.runnables import Runnable
from langchain_core.prompts import PromptTemplate
from app.models.llm import get_default_llm
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

    async def run_async(self, input_text: str, category):
        return await self.chain.ainvoke({"clauses": input_text, "category_name": category})