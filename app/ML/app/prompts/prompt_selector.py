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
    "processingPurpose": unfair_detect_template,
    "collectedItems": unfair_detect_template,
    "retentionPeriod": unfair_detect_template,
    "destructionProcedure": unfair_detect_template,
    "securityMeasures": unfair_detect_template,
    "dataSubjectRights": unfair_detect_template,
    "privacyOfficerInfo": unfair_detect_template,
    "policychanges": unfair_detect_template,
    "thirdPartySharing": unfair_detect_template,
    "additionalUseCriteria": unfair_detect_template,
    "outsourcingInfo": unfair_detect_template,
    "overseasTransfer": unfair_detect_template,
    "sensitiveInfoDisclosure": unfair_detect_template,
    "autoCollectionDevices": unfair_detect_template,
    "behavioralTrakingByThirdParties": unfair_detect_template
}

def get_detect_prompt(category: str):
    return PROMPT_DET_MAP.get(category, unfair_detect_template)