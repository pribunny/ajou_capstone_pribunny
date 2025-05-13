# embedding_generate.py
import os
import pandas as pd
import numpy as np
from tqdm import tqdm
import torch
from transformers import AutoTokenizer, AutoModel

MODEL = 'klue/bert-base'
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModel.from_pretrained(MODEL).to(DEVICE)
model.eval()

def parse_filename(filename):
    name = os.path.splitext(filename)[0]
    parts = name.split("_")
    if len(parts) < 3:
        return None
    chapter, section, article = parts[:3]
    return chapter, section, article

def build_law_dataframe(root_dir):
    rows = []
    for law_name in os.listdir(root_dir):
        law_path = os.path.join(root_dir, law_name)
        if os.path.isdir(law_path):
            for filename in os.listdir(law_path):
                if filename.endswith(".txt"):
                    result = parse_filename(filename)
                    if not result:
                        continue
                    chapter, section, article = result
                    full_path = os.path.join(law_path, filename)
                    with open(full_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    rows.append({
                        "type": "law",
                        "content": content,
                        "law_name": law_name,
                        "chapter": chapter,
                        "section": section,
                        "clause_title": article,
                        "guideline_name": "",
                        "publisher": "",
                        "version": "",
                        "section_title": "",
                        "case_number": "",
                        "court": "",
                        "judgment_date": "",
                        "case_title": "",
                        "issue_summary": "",
                        "judgment_summary": "",
                        "referenced_laws": ""
                    })
    return pd.DataFrame(rows)

def get_klue_embeddings(text_list):
    embeddings = []
    for text in tqdm(text_list, desc="Embedding"):
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        inputs = {k: v.to(DEVICE) for k, v in inputs.items()}
        with torch.no_grad():
            output = model(**inputs)
            cls_embedding = output.last_hidden_state[:, 0, :]
            embeddings.append(cls_embedding.squeeze().cpu().numpy())
    return np.vstack(embeddings)

if __name__ == "__main__":
    df = build_law_dataframe("./법률")
    embeddings = get_klue_embeddings(df["content"].tolist())

    # 저장
    df.to_csv("legal_documents_metadata.csv", index=False, encoding="utf-8")
    np.save("legal_documents_embeddings.npy", embeddings)
