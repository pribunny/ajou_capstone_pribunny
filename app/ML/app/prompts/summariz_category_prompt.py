from langchain.prompts import PromptTemplate

# 조항 별로 결과값 출력하는 부분
summary_processing_info_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 2가지 항목으로 분류하고, 각 항목에 대해 간결하게 요약하라:\n"
        "1. 개인정보 처리의 목적(processingPurpose): 개인정보를 어떤 목적으로 처리하는지 요약하라. (예: 회원가입, 서비스 제공 등)\n"
        "2. 처리하는 개인정보의 항목(collectedItems): 어떤 개인정보 항목을 수집하는지 요약하라. 목적별로 3~4개 항목만 요약하라.\n\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- 두 항목 중 어느 하나에도 해당하지 않으면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"processingPurpose\",\n"
        "  \"summarize_content\": \"회원 가입 및 서비스 제공 목적으로 개인정보를 수집하고 있습니다.\"\n"
        "}}\n"
        "{{\n"
        "  \"category_name\": \"collectedItems\",\n"
        "  \"summarize_content\": \"이름, 연락처, 이메일 등 기본 정보와 결제 수단 관련 항목을 수집합니다.\"\n"
        "}}\n\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_storage_deletion_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 2가지 항목으로 분류하고, 각 항목에 대해 간결하게 요약하라:\n"
        "1. 개인정보의 처리 및 보유기간 : 각 정보를 보유하는 기간에 대한 내용을 포함해 요약하라. 기간이 같다면, 하나로 묶어라.\n"
        "2. 개인정보 파기 절차 및 방법에 관한 사항 : 각 정보의 파기 절차나 방법이 동일한 경우 하나로 묶고 해당 내용을 포함해 요약하라.\n\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- 두 항목 중 어느 하나에도 해당하지 않으면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"retentionPeriod\",\n"
        "  \"summarize_content\": \"회원 정보는 탈퇴 시까지 보관되며, 전자상거래 기록은 관련 법령에 따라 5년간 보관됩니다.\"\n"
        "}}\n"
        "{{\n"
        "  \"category_name\": \"destructionProcedure\",\n"
        "  \"summarize_content\": \"전자적 파일은 복구 불가능한 방식으로 삭제하며, 종이 문서는 분쇄기로 파기합니다.\"\n"
        "}}\n\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_user_protection_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 2가지 항목으로 분류하고, 각 항목에 대해 간결하게 요약하라:\n"
        "1. 정보주체의 권익침해에 대한 구제방법: 해당 항목에 언급된 기관명, 연락처 정보를 포함하여 간단히 요약하라.\n"
        "2. 개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항 : 개인정보 보호책임자나 담당부서의 이름과 연락처를 포함해 요약하라.\n\n"

        "주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- 두 항목 중 어느 하나에도 해당하지 않으면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"remedyForInfringement\",\n"
        "  \"summarize_content\": \"정보주체는 개인정보 침해에 대해 개인정보분쟁조정위원회(☎1833-6972) 등에 구제를 신청할 수 있습니다.\"\n"
        "}}\n"
        "{{\n"
        "  \"category_name\": \"privacyOfficerInfo\",\n"
        "  \"summarize_content\": \"개인정보 보호책임자는 홍길동이며, 개인정보 관련 문의는 개인정보보호팀(☎02-1234-5678)으로 가능합니다.\n"
        "}}\n\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_third_party_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보의 제 3자 제공에 관한 사항 - '개인정보를 제공받는 자 : 제공받는 자의 보유·이용기간' 형식으로 내용을 요약하라. 만약 보유·이용 기간이 없다면, 개인정보를 제공 받는 자만 포함하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"thirdPartySharing\",\n"
        "  \"summarize_content\": \"고객의 결제 처리를 위해 NICE 페이먼츠에 개인정보를 제공하며, 보유·이용기간은 5년입니다. \"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_outsourcing_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보 처리업무 위탁에 관한 사항 - 위탁받은 자(수탁자), 위탁하는 업무의 내용을 포함해 요약하라. 위탁받은 자(수탁자)가 많은 경우(8개 이상) 위탁업무가 많은 상위 3개의 내용만 포함하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"outsourcingInfo\",\n"
        "  \"summarize_content\": \"고객상담 및 배송업무를 위해 CJ대한통운, 고객센터 운영을 위해 ㈜케이티엠하우스에 개인정보 처리를 위탁하고 있습니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_overseas_transfer_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보의 국외 수집 및 이전에 관한 사항 - 개인정보를 이전받는 자의 개인정보 이용목적, 개인정보가 이전되는 국가, 이전되는 개인정보 항목을 포함해 요약하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"overseasTransfer\",\n"
        "  \"summarize_content\": \"고객지원 업무를 위해 Amazon Web Services(미국)에 이름, 이메일 등 개인정보를 이전하고 있습니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_security_measures_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보의 안전성 확보조치에 관한 사항 - 관리적, 기술적, 물리적 조치를 포함해 요약하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"securityMeasures\",\n"
        "  \"summarize_content\": \"개인정보 보호를 위해 접근통제, 데이터 암호화, 백신 프로그램 운영 등 기술적·관리적 조치를 취하고 있습니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_auto_collection_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항 - 쿠키 또는 이와 유사한 기술의 개념, 활용 목적, 개인정보 수집 방법, 거부방법 내용을 포함해 요약하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"autoCollectionDevices\",\n"
        "  \"summarize_content\": \"쿠키를 이용하여 로그인 상태 유지 및 맞춤형 서비스 제공에 활용하며, 브라우저 설정을 통해 거부할 수 있습니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_behavior_tracking_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집·이용 및 거부에 관한 사항 - 제 3자가 수집해가는 행태정보와 관련해 수집해가는 사업자, 수집해가는 행태정보 항목과 목적을 포함해 요약하라. 정보는 3개가 넘어갈 경우 '~등'으로 표현하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"behavioralTrakingByThirdParties\",\n"
        "  \"summarize_content\": \"Google, Meta 등은 이용자의 방문 기록과 검색 이력을 바탕으로 광고 맞춤화를 위해 행태정보를 수집합니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)

summary_rights_and_methods_template = PromptTemplate(
    input_variables=["category_name", "clauses"],
    template=(
        "너는 주어진 clauses만을 이용하여 개인정보 처리방침을 분석하는 역할을 한다.\n\n"

        "다음 항목에 대해 간결하게 요약하라:\n"
        "정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항 - 개인정보의 열람, 정정·삭제 등의 정보주체와 법정대리인이 행사할 수 있는 권리와 권리를 행사할 수 있는 방법을 포함해 요약하라.\n"

        "⚠주의사항:\n"
        "- 반드시 clauses 안의 내용만 사용하라. 임의로 생성하지 마라.\n"
        "- clauses가 항목에 해당하는 내용이 아니라면, 아무것도 출력하지 마라.\n"
        "- 요약은 영어가 아닌 **한글로**, 최대 4줄 이내로 작성하라.\n\n"

        "출력 형식 (예시):\n"
        "{{\n"
        "  \"category_name\": \"dataSubjectRights\",\n"
        "  \"summarize_content\": \"이용자는 개인정보 열람, 정정, 삭제, 처리정지 요청을 할 수 있으며, 홈페이지 또는 고객센터를 통해 신청 가능합니다.\"\n"
        "}}\n"

        "이제 아래 clauses를 분석하라:\n"
        "{clauses}"
    )
)