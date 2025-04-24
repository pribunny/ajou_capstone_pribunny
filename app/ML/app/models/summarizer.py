from langchain_core.runnables import Runnable, RunnableSequence
from app.prompts.summariz_prompt import summary_template
from app.models.base_rag import get_default_llm
from app.utils.logger import logger


class SummaryChain():
    def __init__(
            self
    ):
        self.llm = get_default_llm()
        self.prompt=summary_template
        self._build_chain()

    def _build_chain(self):
        self.chain: Runnable = self.prompt | self.llm

    def run(self, input_text: str):
        return self.chain.invoke({"full_clause": input_text})

def summary_clause(input_text:str):
    logger.info("요약 체인 작동 시작")
    chain = SummaryChain()
    result = chain.run(input_text)
    return result