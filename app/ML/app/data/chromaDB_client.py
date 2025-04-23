import os

import chromadb
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv('../.env')
openai_api_key = os.getenv("OPENAI_API_KEY")

def get_chroma_client():
    '''
        ChromaDB 클라이언트 불러오기 -> persistence
        상위 디렉토리에 폴더 있어야 함
    :return: chromaPersistent Client
    '''

    return chromadb.PersistentClient(path=persist_path)

def get_collection(name: str):
    '''
    콜렉션 불러오기(없으면 생성)
    :param name: collection name
    :return: collection client
    '''

    client = get_chroma_client()
    return client.get_or_create_collection(name=name)


def delete_collection(name: str):
    '''
    콜렉션 삭제하기
    :param name: collection name
    :return: x
    '''

    client = get_chroma_client()
    client.delete_collection(name = name)

def get_vectorstore(collection_name: str,  embedding_model=None):
    '''
    벡터 스토어 반환
    :param collection_name: collection name
    :param embedding_model: 임베딩할 모델, 기본은 huggingface sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
    :return: LangChain VectorStore 객체 (Chroma 기반)
    '''

    if embedding_model is None:
        embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        # embedding_model = OpenAIEmbeddings(
        #     model="text-embedding-ada-002",
        #     openai_api_key=OPENAI_API_KEY
        # )

    client = get_chroma_client()
    return Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embedding_model
    )