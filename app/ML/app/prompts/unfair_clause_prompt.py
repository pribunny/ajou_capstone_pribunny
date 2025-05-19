from langchain.prompts import PromptTemplate

# 독소조항 탐지 수정(++구체적인 법명 언급, 작성 지침 추가)
unfair_detect_purpose_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 처리 목적'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"
        
        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장을 그대로 작성하시오.\n\n"
        
        "※ 근거 기준 명시할 때 주의사항\n"
        "- 개인정보의 처리 목적일 경우 근거 기준으로 '표준 개인정보 보호지침 제18조(개인정보 처리방침의 작성기준 등)'이라 작성하시오\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"
        
        "※ 작성 가이드라인:\n"
        "[개인정보의 처리 목적]\n"
        "- 구체적이고 상세하게 기재해야하며, '~등' 으로 불명확하게 기재하면 안된다.\n"
        "- 고유식별정보의 경우 개인정보 보호법 제24조제1항에서 구체적으로 처리를 요구하거나 허용하는 경우 또는 정보주체로부터 별도의 동의를 받은 경우에만 처리할 수 있다.\n\n"
    )
)
unfair_detect_items_template = PromptTemplate(
    input_variables=["context", "question", "law_clause"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '처리하는 개인정보의 항목'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장을 그대로 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[처리하는 개인정보의 항목]\n"
        "- 개인정보 항목은 구체적으로 작성해야 한다.  '~등'과 같이 축약하거나 추상적이고 모호한 표현을 사용하면 안된다.\n"
        "- 정보주체의 동의 없이 처리하는 개인정보에 대해서는 그 항목과 처리의 법적 근거를 동의를 받아 수집하는 개인정보와 구분하여 기재해야 한다.\n"
        "- 개인정보 처리의 법적 근거는 개인정보 보호법 제15조 제1항 각 호의 사항 또는 개별 법령에 근거하는 경우 해당 법력을 기재한다\n"
        "- 법적 근거를 작성할때 그 법령명 외에 해당하는 조문까지 구체적으로 작성해야한다.\n"
        "- 정보주체의 동의를 받아 처리하는 개인정보는 그 처리 목적에 따른 개인정보 항목을 기재해야한다.\n"
        "- 사무 처리 과정이나 서비스 제공 과정에서 자동으로 생성・수집되는 개인정보 항목이 있는 경우에는 해당 업무와 개인정보 항목을 명시해야 한다.\n"
    )
)

unfair_detect_children_under_14_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '14세 미만 아동의 개인정보 처리에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[14세 미만 아동의 개인정보 처리에 관한 사항]\n"
        "- 아동의 개인정보를 동의를 받아 처리하고자 하는 경우 법정대리인의 동의를 얻어 개인정보를 수집한다는 내용 및 법정대리인 동의 확인방법 등을 기재해야한다.\n"
        "- 법정대리인의 동의 확인 방법은 법령 내용을 그대로 나열하는 것이 아니라 개인정보처리자가 실제로 사용하는 방법을 기재해야 한다.\n"
        "- 개인정보처리자가 14세 미만 아동의 개인정보를 처리하기 위해 개인정보보호법 제22조의2에 따른 법정대리인의 동의를 받기 위하여 아동으로부터 수집하는 법정대리인의 개인정보(이름, 연락처 등)에 대해 기재해야 한다.\n"
        "- 법정대리인의 동의 없이 해당 아동으로부터 직접 수집하는 법정대리인의 개인정보에 대해 '처리하는 개인정보 항목'에 포함하여 기재할 수 있다.\n"
        "- 14세 미만 아동의 개인정보를 처리하여 이를 처리방침에 안내할 때에는 이해하기 쉬운 양식과 명확하고 알기 쉬운 언어를 사용해야 한다. 이때, 서비스의 주된 이용 대상이 14세 미만 아동인 경우 '아동용 개인정보 처리방침'을 별도로 마련해 안내해야 한다.\n\n"
    )
)

unfair_detect_retention_period_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 처리 및 보유 기간'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보의 처리 및 보유 기간]\n"
        "- 정보주체로부터 동의 받는 '보유·이용 기간' 또는 법령에 따른 '보유·이용 기간'에 따라 개인정보를 보유할 수 있다는 내용을 기재해야 한다.\n"
        "- '개인정보 처리 목적'에서 기재한 해당 사무에 따른 구체적인 처리·보유 기간을 기재해야 한다.\n"
        "- 관계 법령에 개인정보의 보유 기간에 대한 근거가 있는 경우에는 해당 법령명 및 조문, 항목, 법령에서 정한 보유 기간을 기재해야 한다.\n"
        "- 보유 기간은 '목적 달성시'와 같이 추상적으로 기재하지 않고 구체적으로 기재해야 하며, 정보주체의 동의를 받아 개인정보를 수집·이용 하는 경우 동의 받는 사항과 일치하도록 기재해야 한다.\n\n"
    )
)

unfair_detect_destruction_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 파기 절차 및 방법에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보의 파기 절차 및 방법에 관한 사항]\n"
        "- 처리하고 있는 개인정보가 불필요하게 되었을 경우 지체없이 파기한다는 내용을 기재해야 한다.\n"
        "- 다른 볍령에 따라 개인정보를 파기하지 않고 보존하는 경우에는 해당 법령 및 조문과 보존하는 개인정보 항목을 구체적으로 기재해야 한다.\n"
        "- '개인정보의 처리 및 보유기간' 항목에서 다른 법령에 따라 보존하는 개인정보의 항목과 보존 근거(법령 및 조문)를 구체적으로 기재한 경우에는 '개인정보의 파기 절차 및 방법에 관한 사항'에서는 기재하지 않아도 된다.\n"
        "- 파기의 절차, 방법 등에 관한 세부적인 내용을 기재해야 한다.\n\n"
    )
)

unfair_detect_third_party_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 제3자 제공에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  제3자 제공 항목에서는 ‘제공받는 자’, ‘제공 목적’, ‘제공 항목’, ‘보유 및 이용 기간’ 모두 포함되어야 한다. 이때, 수집·이용동의서에서는 동의를 거부할 권리가 있다는 사실 및 동의 거부에 따른 불이익이 있는 경우에는 그 불이익의 내용까지 모두 포함되어야 한다.\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우에는 위반으로 간주하지 않습니다.\n"
        "  별도의 화면(더보기, 전체보기, 팝업창 등), 목록 파일 내려받기 기능으로 공개할 수 있다.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보의 제3자 제공에 관한 사항]\n"
        "- 개인정보처리자가 개인정보를 제3자에게 제공하는 경우에는 개인정보보호법 제17조에 따른 사항을 기재하고, 만일 제3자 제공이 없을 경우에는 본 항목을 기재하지 않아도 된다. 이때, 수집·이용동의서는 동의를 거부할 권리가 있다는 사실 및 동의 거부에 따른 불이익이 있는 경우에는 그 불이익의 내용까지 모두 포함되어야 한다.\n"
        "- 정보주체의 동의를 받아 개인정보의 제3자 제공이 이루어지는 경우에는 개인정보를 제공받는 자(제3자), 제3자의 이용목적, 제공하는 개인정보 항목, 제공받는 자의 보유·이용기간을 기재해야 한다.\n"
        "- 국외 제3자 제공이 발생하는 경우, 해당 내용(법적 근거, 제공받는자, 제공목적, 제공항목, 보유 및 이용기간)을 '개인정보의 국외 수집 및 이전에 관한 사항'에서 제3자 제공임을 공개하고 통합하여 작성할 수 있다.\n"
        "- 개인정보처리자가 개인정보보호법 제17조제1항에 따라 제3자에게 개인정보를 제공하는 경우에 해당하면, 정보주체의 동의를 받거나 제15조제1항제2호(법률 규정 또는 법령 상 의무 준수), 제3호(공공기관 소관업무 수행), 제5호(급박한 생명・신체・재산상 이익), 제6호(개인정보처리자의 명백히 정당한 이익 달성), 제7호(공중위생 등 공공의 안전과 안녕을 위하여 긴급한 필요)에 따라 개인정보를 수집한 목적 범위 내에서 동의 없이 제3자에게 제공할 수 있음을 명확하게 기재해야한다\n"
        "- 개인정보처리자가 개인정보보호법 제18조제2항에 따라 목적 외 용도로 제3자에게 개인정보를 제공하는 경우. 이 법 또는 다른 법령에 의하여 이용·제공이 허용된 범위를 벗어나서 개인정보를 이용하거나 제공하지 않는다는 원칙을 기재해야 한다. 이때, 개인정보처리자는 정보주체의 별도 동의를 받거나 법 제18조2항제2호부터 제4호 및 제10호(공공기관의 경우 제2호부터 제10호)에 근거한 경우 개인정보를 수집한 목적 범위 외로 동의 없이 제3자에게 제공할 수 있음을 명확하게 기재해야 한다.\n"
        "- 정보주체의 동의 외의 사유로 개인정보를 제공하는 경우에는 제공의 법적 근거, 개인정보를 제공받는 자(제3자), 제3자의 이용목적, 제공하는 개인정보 항목을 기재하되, 제공받는 자의 보유·이용기간은 기재하지 않아도 된다.\n"
        "- 개인정보를 제공받는 자(제3자)는 '~등' 또는 'A업체 등 O개사'로 축약하지 않아야 한다.\n"
        "- 제공받는 자의 수가 많은 경우 별도의 하면(더보기, 전체보기, 팝업창 등), 목록 파일 내려받기 기능으로 공개할 수 있다.\n\n"
    )
)

unfair_detect_additional_use_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '추가적인 이용·제공이 지속적으로 발생 시 판단 기준'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[추가적인 이용·제공이 지속적으로 발생 시 판단 기준]\n"
        "- 개인정보처리자는 당초 수집 목적과 합리적으로 관련된 범위에서 개인정보보호법 제15조제3항 및 개인정보보호법 제17조제4항에 따라 정보주체의 동의 없이 개인정보를 추가적으로 이용 또는 제공하는 것이 지속적으로 발생하는 경우에는, 관련 내용(제공받는자, 개인정보 항목, 이용・제공 목적, 제공받는 자의 보유 및 이용기간 등)을 개인정보보호법 시행령 제14조의2 제1항 각 호에 따른 추가적인 이용 및 제공하기 위한 고려사항에 따른 판단기준과 함께 구체적으로 기재해야 한다.\n\n"
    )
)

unfair_detect_outsourcing_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보 처리업무의 위탁에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "- 개인정보 처리업무 위탁이 이루어지고 있는 경우에는 '1)위탁받은 자(수탁자), 2)위탁하는 업무의 내용'을 각각 기재해야 한다.\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우에는 위반으로 간주하지 않습니다.\n"
        "  별도의 화면(더보기, 전체보기, 팝업창 등), 목록 파일 내려받기 기능, 위탁하는 업무의 내용과 수탁자를 공개한 웹페이지 링크 삽입 등으로 공개 할 수 있다.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보 처리업무의 위탁에 관한 사항]\n"
        "- 개인정보 처리업무 위탁이 이루어지고 있는 경우에는 '1)위탁받은 자(수탁자), 2)위탁하는 업무의 내용'을 각각 기재해야 한다. 이때, 수탁자란 개인정보 처리업무를 위탁받아 처리하는 자를 말하며, 개인정보 처리업무를 위탁받아 처리하는 자로부터 위탁받은 업무를 다시 위탁받은 제3자(재수탁자)를 포함한다.\n"
        "- 수탁자는 ‘~등’ 으로 축약하지 않아야 하며, 수탁자의 수가 많은 경우 별도의 화면(더보기, 전체보기, 팝업창 등), 목록 파일 내려받기 기능, 위탁하는 업무의 내용과 수탁자를 공개한 웹페이지 링크 삽입 등으로 공개 할 수 있다.\n"
        "- 해외 법인이 국내 고객의 DB를 이용한 업무를 하는 경우는 국외 이전에 의한 개인정보의 처리 위탁에 해당(데이터 보관, 콜센터 대응 등)하여, '10. 개인정보의 국외 수집 및 이전에 관한 사항'에서 기재할 수 있다. 이 경우 위・수탁 관련 사항(수탁자, 위탁 사무)을 포함하여 기재해야 한다.\n"
        "- 개인정보 처리업무를 재위탁하는 경우 개인정보처리자(위탁자)가 수탁자의 개인정보 처리방침 링크 추가를 통해 재수탁자의 위탁업무 내용(재수탁자, 재수탁하는 업무의 내용)을 알릴 수 있다.\n"
        "- 위탁업무의 내용이나 수탁자가 변경되는 경우 개인정보 처리방침에 지체 없이 변경 사항을 공개하여야 한다.\n\n"
    )
)

unfair_detect_overseas_transfer_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 국외 수집 및 이전에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보의 국외 수집 및 이전에 관한 사항]\n"
        "- 개인정보의 국외 수집・이전(제공, 처리위탁, 보관)은 정보주체의 개인정보가 국내와 개인정보 보호 체계가 다른 제3의 국가로 옮겨지는 것으로, 정보주체가 이를 명확히 인지할 수 있도록 개인정보의 제3자 제공, 처리업무의 위탁 등 항목과 별도로 구분하여 기재해야 한다.\n"
        "- 개인정보를 국외에서 직접 수집하여 처리하는 경우 국외에서 직접 수집하는 경우임을 밝히고 개인정보를 처리하는 국가명을 모두 기재하여야 한다.\n"
        "- 개인정보를 국외로 이전(제공, 처리위탁, 보관)하는 경우 개인정보보호법 제28조의8 제1항에 따른 국외 이전의 법적 근거와 개인정보보호법 제28조의8 제2항 각 호의 사항을 기재해야 한다.\n"
        "- 이때, 개인정보보호법 제28조의8 제2항 각 호의 사항이란 이전되는 개인정보 항목, 개인정보가 이전되는 국가, 시기 및 방법, 이전받는 자의 성명(법인인 경우에는 그 명칭과 연락처), 개인정보를 이전받는 자의 개인정보 이용목적 및 보유・이용 기간, 개인정보의 이전을 거부하는 방법, 절차 및 거부의 효과를 말한다.\n"
        "- 개인정보 국외이전의 법적 근거 중 다른 법률에 개인정보의 국외이전에 관한 특별히 규정이 있는 경우에는 그 법률 및 조문도 구체적으로 포함하여 작성하여야 한다.\n"
        "- 개인정보의 국외 제3자 제공 또는 국외 개인정보 처리업무 위탁인 경우 '10. 개인 정보의 국외 수집 및 이전에 관한 사항'에서 통합하여 작성할 수 있다. 이 경우, 개인정보의 제3자 제공 또는 개인정보 처리 업무 위탁임을 밝히고, 개인정보보호법 제17조, 제18조 또는 제26조에 따른 사항을 포함하여야 한다.\n"
    )
)

unfair_detect_security_measures_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보의 안전성 확보조치에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보의 안전성 확보조치에 관한 사항]\n"
        "- 해당 개인정보처리자가 개인정보보호법 제29조, 같은 법 시행령 제30조 및 제30조의2에 따라 시행중인 안전성 확보조치에 관한 사항을 기재하여야 한다.\n"
        "- 안전성 확보조치는 가능한 자세히 기재하되, 해당 개인정보처리자가 상세히 기술한 내용들이 알려짐으로써 개인정보 침해 위협이 증가할 수 있다고 판단되는 경우에는 그 수준을 조절하여 표현할 수 있다.\n\n"
    )
)

unfair_detect_sensitive_info_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '민감정보의 공개 가능성 및 비공개를 선택하는 방법'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[민감정보의 공개 가능성 및 비공개를 선택하는 방법]\n"
        "- 개인정보처리자는 재화 또는 서비스를 제공하는 과정에서 공개되는 정보 중 민감정보가 포함되어 있는 경우 ‘민감정보가 공개될 수 있다는 사실’과 ‘비공개를 선택하는 방법’을 기재해야 한다\n"
        "- 이때, 공개 게시판, 소셜네트워크서비스(SNS) 등 서비스 자체가 공개를 기본으로 하여 상호 의사소통을 목적으로 하고 있어 정보체가 공개 게시판 등에 스스로 입력하는 정보가 공개된다는 사실을 이미 알고 있고, 개인정보처리자가 민감정보가 공개될 것을 예측하기 어려운 경우에는 제외한다.\n"
        "- 공개될 수 있는 민감정보 항목을 모두 기재하고, 비공개를 선택하는 절차와 방법 등에 관한 구체적인 내용을 기재해야 한다.\n\n"
    )
)

unfair_detect_pseudonymized_info_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '가명정보 처리에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[가명정보 처리에 관한 사항]\n"
        "- 개인정보처리자가 가명정보를 처리하는 경우에는 다음의 사항을 구체적으로 기재해야 한다.\n"
        "- 이때, 다음의 사항이란 가명정보의 처리 목적, 가명정보 처리 기간, 가명정보의 제3자 제공에 관한 사항 (해당되는 경우에만 작성), 가명정보 처리의 위탁에 관한 사항 (해당되는 경우에만 작성), 가명처리하는 개인정보의 항목, 개인정보보호법 제28조의4(가명정보에 대한 안전조치 의무 등)에 따른 가명정보의 안전성 확보조치에 관한 사항을 말한다.\n"
        "- '개인정보의 제3자 제공'은 '개인정보의 제3자 제공에 관한 사항'에 포함하고, 위탁은 ‘개인정보 처리업무의 위탁에 관한 사항’의 지침을 따른다. \n\n"

    )
)

unfair_detect_auto_collection_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보 자동 수집 장치의 설치 운영 및 거부에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보 자동 수집 장치의 설치 운영 및 거부에 관한 사항]\n"
        "- 개인정보처리자가 자신이 운영하는 웹・앱에 쿠키 또는 이와 유사한 기술(이하, ‘쿠키 등’)과 같이 개인정보를 자동으로 수집하는 장치를 설치・운영할 경우, 그에 관한 사항을 기재해야 한다.\n"
        "- 개인정보 처리방침에 쿠키 등의 정보에 대한 기본적인 설명과 함께 이를 통해 처리하는 개인정보에 관한 사항을 기재해야 한다. 기본적인 설명이란 쿠키 또는 이와 유사한 기술의 개념, 활용 목적, 개인정보 수집 방법, 거부방법 등을 말한다.\n"
        "- 개인정보처리자가 쿠키 등 개인정보 자동 수집 장치를 통해 행태정보를 수집하고, 정보주체를 식별하여 행태정보를 처리하는 경우, 그 수집・이용・제공 및 거부 등에 대해 기재해야 한다. 이때, 정보주체를 식별하여 행태정보를 처리하는 경우, 「개인정보 보호법」상 개인정보에 해당한다.\n"
        "- 개인정보처리자가 행태정보를 수집・이용하는 경우, ① 개인정보 처리의 법적 근거, ② 수집하는 행태정보의 항목, ③ 수집 방법, ④ 수집 목적, ⑤ 보유・이용 기간, ⑥ 거부 방법 등을 기재해야 한다.\n"
        "- 수집한 행태정보를 제3자에게 제공하는 경우, ① 개인정보 제공의 법적 근거, ② 제공받는 사업자, ③ 제공하는 행태정보의 항목, ④ 제공 목적, ⑤ 보유・이용 기간 등을 기재해야 한다.\n"
        "- '행태정보의 수집・이용・제공 및 거부 등에 관한 사항'은 행태정보임을 밝히고 '개인정보의 처리목적, 수집・제공 항목, 보유 및 이용기간' 항목에서 기재하는 것도 가능하다.\n\n"

    )
)

unfair_detect_behavior_tracking_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집 이용 및 거부에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집 이용 및 거부에 관한 사항]\n"
        "- 개인정보처리자가 운영하는 웹・앱에서 제3자가 개인정보 자동 수집 장치를 통해 행태정보를 수집하도록 허용하는 경우, 수집해가는 행태정보에 관한 사항을 기재해야 한다.\n"
        "- 제3자가 수집해가는 행태정보와 관련하여, ① 수집도구 명칭, ② 수집해가는 사업자, ③ 수집도구 종류, ④ 수집해가는 행태정보 항목, ⑤ 수집해가는 목적, ⑥ 거부방법 등을 기재해야 한다. \n"
        "- 이 중 ‘⑥ 거부방법’의 경우, 웹 브라우저 또는 모바일 단말기에서의 차단방법을 안내하되, 모바일 브라우저를 활용하지 않는 앱의 경우, 자체 앱 또는 모바일 단말기에서의 차단방법을 안내해야 한다.\n\n"

    )
)

unfair_detect_rights_and_methods_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '정보주체와 법정대리인의 권리・의무 및 행사방법에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[정보주체와 법정대리인의 권리・의무 및 행사방법에 관한 사항]\n"
        "- 해당 개인정보처리자에 대해 정보주체가 지니는 개인정보 열람, 정정・삭제, 처리정지, 동의철회, 자동화된 결정 거부・설명 요구 등(이하 ‘열람등’) 행사방법, 행사절차 등을 구체적으로 기재해야 한다.\n"
        "- 누리집(인터넷 홈페이지)을 운영하고 있는 경우에는 누리집(인터넷 홈페이지)을 통한 열람, 정정・삭제 등의 기능을 직관적으로 알기 쉽게 상세히 설명하여야 하며, 열람등 청구를 위한 양식 다운로드 기능 등을 제공하는 것도 가능하다. 이때, ‘회원정보 조회/변경’ 기능, ‘가입해지/회원탈퇴/동의철회’ 기능 등의 이용방법을 상세히 설명해야 한다.\n"
        "- 정보주체와 법정대리인의 권리 행사 방법 및 절차는 실제 현황을 반영하여 작성하여야 하며, 그 방법 및 절차는 법 제38조 제4항에 따라 개인정보의 수집 방법 및 절차에 비해 어렵지 않아야 한다.\n\n"

    )
)

unfair_detect_privacy_officer_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항]\n"
        "- 개인정보처리자가 법 제31조에 따라 지정한 개인정보 보호책임자의 성명 또는 개인정보 보호업무 및 관련 고충사항을 처리하는 부서의 명칭과 전화번호 등 연락처(전화번호, 전자우편 주소 등)를 기재해야 한다.\n"
        "- 개인정보 처리방침에 공개된 연락처는 연결이 어렵거나 지나치게 지연되는 등 정보주체의 권리 행사를 어렵게 하지 않아야 한다.\n"
        "- 정보주체의 알권리 보장 차원에서 개인정보 보호책임자의 성명과 개인정보보호 담당부서, 연락처를 모두 기재하는 것도 가능하다.\n\n"

    )
)
unfair_detect_domestic_agent_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '국내대리인 지정에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[국내대리인 지정에 관한 사항]\n"
        "- 국외사업자로서 법 제31조의2에 따라 국내대리인을 지정하여야 하는 경우 국내대리인의 성명(법인인 경우 법인명, 대표자의 성명), 주소(법인인 경우 영업소 소재지), 전화번호 및 전자우편 주소를 기재해야 한다.\n\n"

    )
)

unfair_detect_remedy_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '정보주체의 권익침해에 대한 구제방법'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[정보주체의 권익침해에 대한 구제방법]\n"
        "- 정보주체가 개인정보침해에 대한 구제를 받을 수 있도록 하기 위하여 법에 따른 전문기관(개인정보침해신고센터, 개인정보 분쟁조정위원회), 수사기관 등을 안내할 것을 권장한다. 이때, 전문기관명 또는 연락처가 변경된 경우에는 현행화하여 정보주체에게 혼란을 주지 않도록 해야한다.\n"
        "- 개인정보처리자를 통한 피해구제가 원만하게 이뤄지지 않을 경우 정보주체가 추가적으로 피해 구제를 요청할 수 있는 방법을 안내할 것을 권장한다.\n\n"

    )
)

unfair_detect_fixed_cctv_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '고정형 영상정보처리기기 운영・관리에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[고정형 영상정보처리기기 운영・관리에 관한 사항]\n"
        "- 고정형 영상정보처리기기 운영・관리 방침을 별도로 제정・공개하는 경우에는 해당하지 않는다.\n"
        "- 고정형영상정보처리기기운영자는 개인정보보호법 시행령 제25조 제1항에 따른 사항을 포한 운영・관리 방침을 마련해야 한다.\n\n"

    )
)

unfair_detect_mobile_cctv_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '이동형 영상정보처리기기 운영・관리에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[이동형 영상정보처리기기 운영・관리에 관한 사항]\n"
        "- 이동형 영상정보처리기기 운영・관리 방침을 별도로 제정・공개하는 경우에는 해당하지 않는다.\n"
        "- 이동형영상정보처리기기운영자는 다음 각 호의 사항이 포함된 이동형 영상정보처리기기 운영・관리 방침을 마련해야 한다.(표준지침 제39조의3)\n\n"

    )
)

unfair_detect_optional_clauses_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항]\n"
        "- 개인정보처리자는 법령에서 규정하고 있는 안전성 확보조치 관련 의무사항 외에 개인정보처리자가 자율적으로 이행하고 있는 개인정보보호 조치 사항에 대해 기재할 수 있다.\n\n"

    )
)

unfair_detect_policy_changes_template = PromptTemplate(
    input_variables=["context", "question"],
    template=(
        "You are a legal assistant tasked with analyzing clauses in a privacy policy to identify whether they are legally unfair or violate any laws.\\n"
        "You must identify unfair terms **only** for the item titled '개인정보 처리방침의 변경에 관한 사항'.\\n\\n"
        "Analyze the clause based on the following two criteria:\\n"
        "1. 법적 기준 (Context): 아래 'Context'에 포함된 개인정보보호법, 개인정보보호법 시행령, 표준지침 등 법령\n"
        "2. 개인정보처리방침 및 수집·이용동의서 작성 가이드라인 (Guidelines): 개인정보처리방침을 작성할 때 준수해야 할 항목별 작성 기준\n\n"

        "분석 시 아래 원칙을 따르십시오:\n"
        "- Full_clause가 context에 포함된 법 조항을 위반한 경우:\n"
        "  해당 법 조항과 관련있는 가이드라인을 매핑하여,\n"
        "  개인정보처리방침 또는 수집·이용동의서가 어떻게 작성되어야 하는지를 다음 형식으로 서술하십시오:\n"
        "  개인정보처리방침은 ~~하게 작성되어야 합니다. 또는 수집·이용동의서는 ~~하게 작성되어야 합니다.\n\n"
        "- 반드시 위 문장을 포함한 서술형 설명으로 작성하십시오. 단순 법 조항 나열이 아닌, 조항의 의미와 그에 따른 작성 방식까지 명확히 설명하십시오.\n\n"

        "- Full_clause가 아래의 경우에 해당하는 경우도 위반으로 간주합니다.\n"
        "  '동의함'이 기본값으로 설정되어 있는 경우\n"
        "  해당하는 경우 관련 규정을 근거로 문제를 지적하십시오.\n\n"

        "Full_clause:\n{question}\n\n"
        "Context (법적 기준):\n{context}\n\n"

        "Full_clause에 아무런 문제가 없는 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: false\n"

        "Full_clause가 context에 포함된 법률 조항을 위반한 경우, 다음 형식에 따라 json 형식으로 답변하십시오:\n"
        "isUnfair: true"
        "problemStatement: <문제가 되는 문장을 그대로 작성>\n"
        "reason: <위 원칙에 따라 서술된 문제 설명 포함>\n"
        "legalBasis: <근거 기준>\n"

        "※ problemStatement 명시할 때 주의사항\n"
        "- 반드시 문제가 되는 문장만 작성하시오.\n\n"

        "※ 근거 기준 명시할 때 주의사항\n"
        "- 작성 가이드라인은 근거 기준에 포함하지 마십시오.\n\n"

        "※ 작성 가이드라인:\n"
        "[개인정보 처리방침의 변경에 관한 사항]\n"
        "- 개인정보 처리방침을 변경하는 경우 변경 및 시행 시기, 변경된 내용을 지속적으로 공개해야 한다.\n"
        "- 이전의 개인정보 처리방침이 있는 경우에는 그간의 변경 이력을 기재해야 한다. 이 경우, 정보주체가 이전 버전을 비교할 수 있도록 하거나, 변경의 주요 내용을 별도로 안내하는 등의 방식으로 변경 사항을 알리는 것을 권장한다.\n"
        "- 주요 변경 사항을 별도로 안내하는 경우 웹페이지 팝업창 등을 통해 정보주체가 쉽게 확인할 수 있는 방법으로 알려야 한다.\n\n"
    )
)

collect_data_template = PromptTemplate( #수집하는 항목 탐지
    input_variables= ["full_clause"],
    template = (
        # 들어온 clause에서 '수집하는 항목'을 모두 나열하라. (List 형태로 나열)
        # 수집하는 항목이 여러 개일 경우에도 '~등이 있다'로 표현하지 않고 모두 표시한다.
        # 수집하는 항목 중에서 사용자가 거부권을 행사할 수 있는 경우 '선택' 카테고리로, 사용자가 거부권을 행사할 수 있지만 서비스 이용에 제약을 받는 경우 '필수' 카테고리에 넣어라
        # '선택'과 '필수' 카테고리를 json 형식으로 반환하라. ex. {{'선택' : '선택 카테고리에 해당하는 항목 전체'}, {'필수' : '필수 카테고리에 해당하는 항목 전체'}}
        # '회원가입단계'에서 '수집하는 개인정보 항목 동의'를 받는 조항에 대해 진행한다 -> 필수, 선택, 고유식별정보 및 민감정보로 나누어 사용자에게 보여준다.
        # 들어온 clause에서 사용자에게 '필수'로 제공받는 개인정보 항목을 '필수' 카테고리에 묶어 List 형태로 나열하라.
        #   - 이때, 필수 조항들과는 다르게 별도로 필수 조항을 확인 받는 경우, 민감 정보나 고유식별 정보에 묶여있는 경우 '고유식별정보 및 민감정보' 카테고리에 묶어라.
        # 들어온 clause에서 사용자에게 개인정보 항목을 받을 때 '선택'을 받는 항목을 '선택' 카테고리에 묶어 List 형태로 나열하라.
        # 필수, 선택, 고유식별정보 및 민감정보 카테고리와 그 내용들을 Json 형식으로 반환하라. ex. {{'선택' : '성별, 나이'}, {'필수' : '이름, 주소지'}, {'고유식별정보 및 민감정보':'주민등록번호, 여권번호'}}
        #   - 이때, 카테고리에 포함된 단어들은 '~등'으로 내용을 축약하지 않고 모두 반환한다.

        "You are analyzing a clause from a privacy policy.\n"
        "Your task is to extract **all types of personal information** that are collected from users in the clause.\n\n"

        "Instructions:\n"
        "1. List all data items being collected. Do not summarize using expressions like '~등' – list every item explicitly.\n"
        "2. Classify the collected data into the following categories:\n"
        "   - '선택': If the user can opt out without losing service access.\n"
        "   - '필수': If the user must provide the data to use the service.\n"
        "   - '민감/고유식별정보': If the clause explicitly asks for sensitive data (e.g. 여권번호, 주민등록번호) or requires separate consent for sensitive/unique identifiers.\n"
        "3. Return your answer in proper JSON format as shown below:\n"
        "{\n"
        "  \"선택\": [\"Gender\", \"Age\"],\n"
        "  \"필수\": [\"Name\", \"Address\"],\n"
        "  \"민감/고유식별정보\": [\"Resident Registration Number\", \"Passport Number\"]\n"
        "}\n\n"

        "If a category has no applicable items, return the string \"해당 항목이 없습니다.\" for that category instead of a list.\n"
        "Your response must not include explanations — only the JSON result.\n"
    )
)