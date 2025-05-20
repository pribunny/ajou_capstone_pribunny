# app/milvus_client.py
from pymilvus import connections
import os

milvus_host = os.getenv("MILVUS_HOST", "124.0.3.241")
milvus_port = os.getenv("MILVUS_PORT", "19530")

def init_milvus_connection():
    connections.connect(
        alias="default",
        host=milvus_host,  # 또는 EC2 IP
        port=milvus_port,
    )
