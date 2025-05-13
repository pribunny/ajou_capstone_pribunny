from app.prompts.summariz_prompt import summary_template

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

def get_prompt_summary(category: str):
    return PROMPT_SUM_MAP.get(category, summary_template)