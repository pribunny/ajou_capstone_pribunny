from app.prompts.summariz_prompt import summariz_category_prompt #경로 수정했음
from app.prompts.unfair_clause_prompt import unfair_clause_prompt #경로 수정했음

PROMPT_SUM_MAP = {
    "processingPurpose": summary_purpose_template,
    "collectedItems": summary_items_template,
    "childrenUnder14": summary_children_under_14_template, # 추가
    "retentionPeriod": summary_retention_period_template,
    "destructionProcedure": summary_destruction_template,
    "thirdPartySharing": summary_third_party_template,
    "additionalUseCriteria": summary_additional_use_template,
    "outsourcingInfo": summary_outsourcing_template,
    "overseasTransfer": summary_overseas_transfer_template,
    "securityMeasures": summary_security_measures_template,
    "sensitiveInfoDisclosure": summary_sensitive_info_template,
    "pseudonymizedInfo": summary_pseudonymized_info_template, # 추가
    "autoCollectionDevices": summary_auto_collection_template,
    "behavioralTrakingByThirdParties": summary_behavior_tracking_template,
    "dataSubjectRights": summary_rights_and_methods_template,
    "privacyOfficerInfo": summary_privacy_officer_template,
    "domesticAgent": summary_domestic_agent_template, # 추가
    "remedyForInfringement": summary_remedy_template, # 추가
    "fixedCCTVOperation": summary_fixed_cctv_template, # 추가
    "mobileCCTVOperation": summary_mobile_cctv_template, # 추가
    "optionalPrivacyClauses": summary_optional_clauses_template, # 추가
    "policychanges": summary_policy_changes_template,
}

def get_summary_detect(category: str):
    return PROMPT_SUM_MAP.get(category, summary_template)

PROMPT_DET_MAP = {
    "processingPurpose": unfair_detect_purpose_template, #개인정보처리목적
    "collectedItems": unfair_detect_items_template, #처리하는 개인정보의 항목
    "childrenUnder14": unfair_detect_children_under_14_template, # 추가, 14세 미만 아동의 개인정보 처리에 관한 사항
    "retentionPeriod": unfair_detect_retention_period_template, # 개인정보의 처리 및 보유기간
    "destructionProcedure": unfair_detect_destruction_template, #개인정보의 파기 절차 및 방법에 관한 사항
    "thirdPartySharing": unfair_detect_third_party_template, #개인정보의 제3자에 관한 사항
    "additionalUseCriteria": unfair_detect_additional_use_template, #추가적인 이용, 제공이 지속적으로 발생시 판단 기준
    "outsourcingInfo": unfair_detect_outsourcing_template, #개인정보 처리업무의 위탁에 관한 사항
    "overseasTransfer": unfair_detect_overseas_transfer_template, #개인정보의 국외 수집 및 이전에 관한 사항
    "securityMeasures": unfair_detect_security_measures_template, #개인정보의 안전성 확보조치에 관한 사항
    "sensitiveInfoDisclosure": unfair_detect_sensitive_info_template, #민감정보의 공개 가능성 및 비공개를 선택하는 방법
    "pseudonymizedInfo": unfair_detect_pseudonymized_info_template, # 추가, 가명정보처리에 관한 사항
    "autoCollectionDevices": unfair_detect_auto_collection_template, #개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항
    "behavioralTrakingByThirdParties": unfair_detect_behavior_tracking_template, #개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집, 이용 및 거부에 관한 사항
    "dataSubjectRights": unfair_detect_rights_and_methods_template, #정보주체와 법정대리인의 권리, 의무 및 행사방법에 관한 사항
    "privacyOfficerInfo": unfair_detect_privacy_officer_template, # 개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항
    "domesticAgent": unfair_detect_domestic_agent_template, # 추가, 국내대리인 지정에 관한 사항
    "remedyForInfringement": unfair_detect_remedy_template, # 추가, 정보주체의 권익침해에 관한 사항
    "fixedCCTVOperation": unfair_detect_fixed_cctv_template, # 추가, 고정형 영상정보처리기기 운영, 관리에 관한 사항
    "mobileCCTVOperation": unfair_detect_mobile_cctv_template, # 추가, 이동형 영상정보처리기기 운영, 관리에 관한 사항
    "optionalPrivacyClauses": unfair_detect_optional_clauses_template, # 추가,   개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항
    "policychanges": unfair_detect_policy_changes_template, #개인정보 처리방침의 변경에 관한 사항
}

def get_detect_prompt(category: str):
    return PROMPT_DET_MAP.get(category, unfair_detect_template)