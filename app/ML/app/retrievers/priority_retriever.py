from typing import List, Tuple
from langchain_core.documents import Document

class PrioritizedLawRetriever:
    def __init__(self, vectorstore, law_priority: List[str], top_k_per_law: int = 5, final_top_k: int = 5):
        """
        Args:
            vectorstore: Chroma, FAISS 등 벡터스토어 인스턴스
            law_priority: 우선순위대로 검색할 법령 리스트
            top_k_per_law: 각 법률에서 검색할 문서 수
            final_top_k: 전체에서 유사도 기준으로 반환할 최종 문서 수
        """
        self.vectorstore = vectorstore
        self.law_priority = law_priority
        self.top_k_per_law = top_k_per_law
        self.final_top_k = final_top_k

    def retrieve(self, query: str) -> List[Document]:
        results_with_scores = []

        for law_name in self.law_priority:
            docs = self.vectorstore.similarity_search_with_score(
                query=query,
                k=self.top_k_per_law,
                filter={"law": law_name}  # ✅ 특정 법령 필터링
            )
            results_with_scores.extend(docs)

        # ✅ 유사도 기준으로 정렬 후 상위 n개 선택
        sorted_results = sorted(results_with_scores, key=lambda x: x[1])  # x[1] = score
        top_docs = [doc for doc, _ in sorted_results[:self.final_top_k]]

        return top_docs

    def retrieve_with_scores(self, query: str) -> List[Tuple[Document, float]]:
        results_with_scores = []

        for law_name in self.law_priority:
            docs = self.vectorstore.similarity_search_with_score(
                query=query,
                k=self.top_k_per_law,
                filter={"law": law_name}
            )
            results_with_scores.extend(docs)

        sorted_results = sorted(results_with_scores, key=lambda x: x[1])
        return sorted_results[:self.final_top_k]