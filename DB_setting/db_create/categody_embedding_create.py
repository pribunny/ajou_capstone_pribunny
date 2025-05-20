from sentence_transformers import SentenceTransformer
from pymilvus import connections, Collection

connections.connect(alias="default", host="localhost", port="19530")

# 1. 모델 로딩
model = SentenceTransformer("jhgan/ko-sbert-sts")

# 2. 카테고리 설명 정의
category_map = {
    "processingPurpose": "개인정보처리자가 개인정보를 처리하기 위한 목적을 기재한다. 사무의 개인정보 처리 목적을 정보주체가 알기 쉽게 이해할 수 있도록 기재하여야 한다.",
    "collectedItems": "개인정보처리자가 처리하고 있는 각가의 개인정보 항목을 기재한다. 처리하는 개인정보 항목은 개인정보 처리 목적에 필요한 최소한의 개인정보여야 하며 실제 처리 현황과 일치하여야 한다. 정보주체의 동의를 받아 처리하는 개인정보는 그 처리 목적에 따른 개인정보항목을 기재하여 한다.s",
    "retentionPeriod": "개인정보의 처리 및 보유 기간에 대해 설명한다.",
    "destructionProcedure": "개인정보의 파기 절차 및 방법에 대해 설명한다.",
    "securityMeasures": "개인정보를 안전하게 보호하기 위해 기술적, 관리적, 물리적 조치를 포함한 다양한 보호 수단을 적용하는 방식에 대한 설명입니다.",
    "dataSubjectRights": "개인정보의 주체가 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 등을 요구할 수 있는 권리와 그 행사 방법에 대한 설명입니다.",
    "privacyOfficerInfo": "개인정보 보호책임자의 이름, 소속, 연락처 등 정보와, 개인정보 처리 관련 문의 및 고충 처리를 담당하는 부서에 대한 설명입니다.",
    "policyChanges": "개인정보처리방침이 변경되었을 경우의 공지 방법, 변경 내역 및 시점 등에 대한 설명입니다.",
    "thirdPartySharing": "개인정보를 제3자에게 제공하는 경우의 제공 대상, 제공 항목, 제공 목적 및 제공 근거 등에 대한 설명입니다.",
    "additionalUseCriteria": "개인정보를 수집 목적 외로 추가적으로 이용하거나 제3자에게 제공할 때 필요한 요건, 고려 요소 및 판단 기준에 대한 설명입니다.",
    "outsourcingInfo": "개인정보 처리업무를 외부 업체에 위탁하는 경우의 위탁 대상, 내용, 책임 및 관리 방식에 대한 설명입니다.",
    "overseasTransfer": "개인정보를 국외로 이전하는 경우의 수집 국가, 이전 목적, 보관 위치 및 보호 조치에 대한 설명입니다.",
    "sensitiveInfoDisclosure": "민감정보(예: 건강정보, 정치 성향 등)의 처리 여부, 공개 가능성, 비공개 설정 방법 등에 대한 설명입니다.",
    "autoCollectionDevices": "웹사이트 또는 앱에서 쿠키, 로그파일 등 자동으로 개인정보를 수집하는 장치의 설치, 운용 방법과 이용자가 이를 거부할 수 있는 방법에 대한 설명입니다.",
    "behavioralTrackingByThirdParties": "광고 등 목적을 위해 제3자가 자동 수집 장치를 통해 이용자의 온라인 행동 정보를 수집할 수 있도록 허용하는 경우, 수집 내용과 이용자의 거부 방법에 대한 설명입니다.",
}

# 3. 컬렉션 가져오기
collection = Collection("category_embeddings")

# 4. 임베딩 및 데이터 삽입
data = []
for key, desc in category_map.items():
    emb = model.encode(desc).tolist()
    data.append((key, desc, emb))

# 5. 데이터 삽입
collection.insert([
    [item[0] for item in data],  # category
    [item[1] for item in data],  # description
    [item[2] for item in data],  # embedding
])

print("카테고리 설명 임베딩 저장 완료")
