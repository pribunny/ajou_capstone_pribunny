from langchain.prompts import PromptTemplate

# 조항 별로 결과값 출력하는 부분
summary_purpose_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"
        
        "개인정보 처리의 목적 - 개인정보를 처리하는 목적을 포함해 요약하라. ex)회원가입 및 관리, 재화 및 서비스 제공의 목적으로 개인정보를 처리합니다.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_items_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "처리하는 개인정보의 항목 - 수집하는 개인정보 항목을 포함해 요약하라. 각각의 처리 목적에 따라 처리하는 개인정보 항목을 3~4개 포함하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_children_under_14_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "14세 미만 아동의 개인정보 처리에 관한 사항 - 아동으로 부터 수집하는 법정대리인의 개인정보(이름, 연락처 등)를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_retention_period_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보의 처리 및 보유기간 - 각 정보를 보유하는 기간에 대한 내용을 포함해 요약하라. 기간이 같다면, 하나로 묶어라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_destruction_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 파기 절차 및 방법에 관한 사항 - 각 정보의 파기 절차나 방법이 동일한 경우 하나로 묶고 해당 내용을 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_third_party_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보의 제 3자 제공에 관한 사항 - '개인정보를 제공받는 자 : 제공받는 자의 보유·이용기간' 형식으로 내용을 요약하라. 만약 보유·이용 기간이 없다면, 개인정보를 제공 받는 자만 포함하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_additional_use_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "추가적인 이용·제공이 지속적으로 발생 시 판단 기준 - 제공받는 자, 개인정보의 항목, 이용·제공 목적, 보유 및 이용기간을 포함해 요약하라. 추가적인 이용·제공을 위한 고려사항이 있다면 해당 내용도 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_outsourcing_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 처리업무 위탁에 관한 사항 - 위탁받은 자(수탁자), 위탁하는 업무의 내용을 포함해 요약하라. 위탁받은 자(수탁자)가 많은 경우(8개 이상) 위탁업무가 많은 상위 3개의 내용만 포함하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_overseas_transfer_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보의 국외 수집 및 이전에 관한 사항 - 개인정보를 이전받는 자의 개인정보 이용목적, 개인정보가 이전되는 국가, 이전되는 개인정보 항목을 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_security_measures_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보의 안전성 확보조치에 관한 사항 - 관리적, 기술적, 물리적 조치를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_sensitive_info_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "민감정보의 공개 가능성 및 비공개를 선택하는 방법 - 공개될 수 있는 민감정보 항목을 포함하고, 비공개를 선택할 수 있는 절차나 방법이 존재하는 항목들에 대한 언급을 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_pseudonymized_info_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "가명정보 처리에 관한 사항 - 가명정보의 처리 목적과 가명처리하는 개인정보의 항목을 포함하고, 제 3자에게 제공하거나 위탁을 하는 경우 해당 제 3자나 수탁자를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_auto_collection_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 자동 수집 장치의 설치·운영 및 그 거부에 관한 사항 - 쿠키 또는 이와 유사한 기술의 개념, 활용 목적, 개인정보 수집 방법, 거부방법 내용을 포함해 요약하라.\n"

        "Return your answer strictly in the following JSON format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"(summarized content here)\"\n"
        "  }}\n"
        "]\n\n"

        "clauses: {clauses}\n\n"
    ))

summary_behavior_tracking_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집·이용 및 거부에 관한 사항 - 제 3자가 수집해가는 행태정보와 관련해 수집해가는 사업자, 수집해가는 행태정보 항목과 목적을 포함해 요약하라. 정보는 3개가 넘어갈 경우 '~등'으로 표현하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_rights_and_methods_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항 - 개인정보의 열람, 정정·삭제 등의 정보주체와 법정대리인이 행사할 수 있는 권리와 권리를 행사할 수 있는 방법을 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_privacy_officer_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항 - 개인정보 보호책임자나 담당부서의 이름과 연락처를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_domestic_agent_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "국내대리인 지정에 관한 사항 - 국내대리인의 성명(법인명이나 대표자의 성명도 해당 됨), 주소, 전화번호 및 전자우편 주소 등 국내대리인의 정보를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_remedy_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "정보주체의 권익침해에 대한 구제방법 - 작성된 기관명과 연락처를 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_fixed_cctv_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "고정형 영상정보처리기기 운영·관리에 관한 사항 - 고정형 영상정보처리기기의 설치 근거 및 설치 목적, 설치 대수의 내용을 포함하라. 또한, 관리책임자와 담당부서에 대한 정보와 영상정보 보호, 영상정보 확인 방법 및 장소에 관한 내용을 포함해 요약하라. 만약 위탁받는 자가 있다면 해당 내용도 포함하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_mobile_cctv_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "이동형 영상정보처리기기 운영·관리에 관한 사항 - 이동형 영상정보처리기기의 설치 근거 및 설치 목적, 설치 대수의 내용을 포함하라. 또한, 관리책임자와 담당부서에 대한 정보와 영상정보 보호, 영상정보 확인 방법 및 장소에 관한 내용을 포함해 요약하라. 만약 위탁받는 자가 있다면 해당 내용도 포함하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_optional_clauses_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항 - 개인정보보호 조치 사항을 나열하라. ex) ISMS-P, 개인정보 영향평가, 개인정보 보호의 날 협력사 참여를 진행하고 있다.\n\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

summary_policy_changes_template = PromptTemplate(
    input_variables = ["category_name","clauses"],
    template = (
        "You are a helpful assistant. Answer only based on the given Full_clause.\n\n"
        "The clause already belongs to a specific category: \"{category_name}\".\n"
        "Summarize the content accurately and concisely, without omitting any contextually important information.\n\n"
        "Follow the category-specific guideline below when summarizing:\n\n"

        "개인정보 처리방침의 변경에 관한 사항 - 개인정보 처리방침 변경을 확인할 수 있는 방법과 최근 변경 날짜가 존재한다면 해당 내용을 포함해 요약하라.\n"

        "If there is any part of the clause that does NOT belong to the category \"{category_name}\", "
        "classify it under the category '기타' and summarize that part separately.\n\n"

        "Return your answer strictly in the following JSON array format:\n"
        "[\n"
        "  {{\n"
        "    \"category_name\": \"{category_name}\",\n"
        "    \"summarize_content\": \"...\"\n"
        "  }}{optional_etc_entry}\n"
        "]\n\n"
        "If there is no unrelated content, return only one object in the array.\n\n"

        "Full_clause:\n{clauses}"
    ))

# etc_summary = PromptTemplate(
#     input_variables=["clauses"],
#     template=(
#         "You are a helpful assistant. The given Full_clause contains multiple fragments, all of which have been classified under the category '기타'.\n\n"
#         "Some of these fragments may share a common topic or purpose. Your task is to group related content together and summarize each group separately.\n\n"
#         "Each summarized group should be treated as its own item, but the category name must remain '기타'.\n\n"
#         "Steps:\n"
#         "1. Read through all the clause fragments.\n"
#         "2. Identify which fragments are related or contextually similar.\n"
#         "3. Group related fragments together.\n"
#         "4. For each group, write a concise and accurate summary.\n"
#         "5. Output one JSON object per group, all using the category_name '기타'.\n\n"
#
#         "Return your output strictly in the following JSON array format:\n"
#         "[\n"
#         "  {{\n"
#         "    \"category_name\": \"기타\",\n"
#         "    \"summarize_content\": \"(summary for related group 1)\"\n"
#         "  }},\n"
#         "  {{\n"
#         "    \"category_name\": \"기타\",\n"
#         "    \"summarize_content\": \"(summary for related group 2)\"\n"
#         "  }}\n"
#         "]\n\n"
#
#         "Only include a new object when the grouped content is meaningfully distinct from others.\n"
#         "If no grouping is possible, return each clause as a separate summary object with category_name '기타'.\n\n"
#         "Full_clause:\n{clauses}"
#     )
# )

