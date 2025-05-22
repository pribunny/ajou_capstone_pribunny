import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import BackIcon from '../assets/back-button.png';
import { useLocation } from 'react-router-dom';

export default function ResultUnfairDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unfairId, unfairItems } = location.state || { unfairId: '', unfairItems: [] };

    const categoryNameMap = {
      processingPurpose: "개인정보 처리 목적",
      collectedItems: "처리하는 개인정보의 항목",
      childrenUnder14: "14세 미민 아동의 개인정보 처리에 관한 사항",
      retentionPeriod: "개인정보의 처리 및 보유 기간",
      destructionProcedure: "개인정보의 파기 절차 및 방법에 관한 사항",
      thirdPartySharing: "개인정보의 제3자 제공에 관한 사항",
      additionalUseCriteria: "추가적인 이용, 제공이 지속적으로 발생 시 판단 기준",
      outsourcingInfo: "개인정보 처리업무 위탁에 관한 사항",
      overseasTransfer: "개인정보의 국외수집 및 이전에 관한 사항",
      securityMeasures: "개인정보의 안전성 확보 조치에 관한 사항",
      sensitiveInfoDisclosure: "민감정보의 공개 가능성 및 비공개를 선택하는 방법",
      pseudonymizedInfo: "가명정보 처리에 관한 사항",
      autoCollectionDevices: "개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항",
      behavioralTrackingByThirdParties: "개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집,이용 및 거부에 관한 사항",
      dataSubjectRights: "정보주체와 법정대리인의 권리, 의무 및 행사 방법에 관한 사항",
      privacyOfficerInfo: "개인정보 보호책임자의 성명 또는 개인정보 업무 담당 부서 및 고충사항을 처리하는 부서에 관한 사항",
      domesticAgent: "국내대리인 지정에 관한 사항",
      remedyForInfringement: "정보주체의 권익침해에 대한 구제방법",
      fixedCCTVOperation: "고정형 영상정보처리기기 운영, 관리에 관한 사항",
      mobileCCTVOperation: "이동형 영상정보처리기기 운영, 관리에 관한 사항",
      optionalPrivacyClauses: "개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항",
      policyChanges: "개인정보처리방침의 변경에 관한 사항"
    };

  return (
    <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
    {/* ✅ 상단 타이틀 & 버튼 */}
    <div className="relative flex items-center justify-center h-[40px]">
    <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
        <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
    </button>
    <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
        PRIBUNNY
    </h2>
    <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
        <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
    </button>
    </div>
    {/* ✅ 구분선 */}
    <div className="w-full h-[1px] bg-black mb-2" />

      {/* 뒤로가기 + 출력 전체 묶음 - 스크롤 가능 */}
      <div className="w-full flex-1 overflow-y-auto mt-2 px-1">

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="w-[31px] h-[31px] bg-transparent flex items-center justify-center mb-3"
        >
          <img src={BackIcon} alt="뒤로가기" className="w-[31px] h-[31px]" />
        </button>

        {/* 상세 내용 */}
        {/* <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
          {unfairItems.map((item, idx) => (
            <div key={idx} className="mb-3">
              <strong className="block mb-1">{item.category}</strong>
              {item.detect_content.split('\n').map((line, i) => (
                <p key={i} className="m-0 p-0 leading-snug">{line}</p>
              ))}
            </div>
          ))}
        </div> */}
        {/* 상세 내용 */}
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
          {unfairItems
            .filter(item => Array.isArray(item.detectedItems) && item.detectedItems.some(d => d.isUnfair))
            .map((item, idx) => (
              <div key={idx} className="mb-4">
                <strong className="block mb-1 text-base font-semibold">
                  {categoryNameMap[item.category] || item.category}
                </strong>

                {item.detectedItems
                  .filter(d => d.isUnfair)
                  .map((detect, dIdx) => (
                    <div key={dIdx} className="mb-2">
                      <p className="mb-1"><strong>문제 진술:</strong> {detect.problemStatement}</p>
                      <p className="mb-1"><strong>사유:</strong> {detect.reason}</p>
                      <p className="mb-1 text-xs text-gray-600"><strong>법적 근거:</strong> {detect.legalBasis}</p>
                    </div>
                  ))}
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
