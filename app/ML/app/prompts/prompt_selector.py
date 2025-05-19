from app.prompts.summariz_prompt import summary_template
from app.prompts.unfair_clause_prompt import unfair_detect_template

PROMPT_SUM_MAP = {
    "processingPurpose": summary_template,
    "collectedItems": summary_template,
    "retentionPeriod": summary_template,
    "destructionProcedure": summary_template,
    "securityMeasures": summary_template,
    "dataSubjectRights": summary_template,
    "privacyOfficerInfo": summary_template,
    "policychanges": summary_template,
    "thirdPartySharing": summary_template,
    "additionalUseCriteria": summary_template,
    "outsourcingInfo": summary_template,
    "overseasTransfer": summary_template,
    "sensitiveInfoDisclosure": summary_template,
    "autoCollectionDevices": summary_template,
    "behavioralTrakingByThirdParties": summary_template,
}

def get_summary_detect(category: str):
    return PROMPT_SUM_MAP.get(category, summary_template)

PROMPT_DET_MAP = {
    # "processingPurpose": unfair_detect_purpose_template,
    # "collectedItems": unfair_detect_items_template,
    # "childrenUnder14": unfair_detect_children_under_14_template, # 추가
    # "retentionPeriod": unfair_detect_retention_period_template,
    # "destructionProcedure": unfair_detect_destruction_template,
    # "thirdPartySharing": unfair_detect_third_party_template,
    # "additionalUseCriteria": unfair_detect_additional_use_template,
    # "outsourcingInfo": unfair_detect_outsourcing_template,
    # "overseasTransfer": unfair_detect_overseas_transfer_template,
    # "securityMeasures": unfair_detect_security_measures_template,
    # "sensitiveInfoDisclosure": unfair_detect_sensitive_info_template,
    # "pseudonymizedInfo": unfair_detect_pseudonymized_info_template, # 추가
    # "autoCollectionDevices": unfair_detect_auto_collection_template,
    # "behavioralTrakingByThirdParties": unfair_detect_behavior_tracking_template,
    # "dataSubjectRights": unfair_detect_rights_and_methods_template,
    # "privacyOfficerInfo": unfair_detect_privacy_officer_template,
    # "domesticAgent": unfair_detect_domestic_agent_template, # 추가
    # "remedyForInfringement": unfair_detect_remedy_template, # 추가
    # "fixedCCTVOperation": unfair_detect_fixed_cctv_template, # 추가
    # "mobileCCTVOperation": unfair_detect_mobile_cctv_template, # 추가
    # "optionalPrivacyClauses": unfair_detect_optional_clauses_template, # 추가
    # "policychanges": unfair_detect_policy_changes_template,
}

def get_detect_prompt(category: str):
    return PROMPT_DET_MAP.get(category, unfair_detect_template)