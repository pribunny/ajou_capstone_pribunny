import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import BackIcon from '../assets/back-button.png';
import { useLocation } from 'react-router-dom';

export default function ResultSummaryDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { summaryId, summaryItems } = location.state || {};
  const [userPrivacyItems, setUserPrivacyItems] = useState([]);

    // 스토리지에서 개인정보 항목 가져오는 함수
    useEffect(() => {
    chrome.storage.local.get(['privacySelections'], (result) => {
        if (result.privacySelections?.items) {
        setUserPrivacyItems(result.privacySelections.items);
        }
    });
    }, []);

    // 개인정보 항목 표시하는 함수
    function highlightMatchedTerms(text, terms) {
        if (!terms || terms.length === 0) return text;

        const pattern = new RegExp(`(${terms.join('|')})`, 'gi');
        const parts = text.split(pattern);

        return parts.map((part, idx) =>
            terms.includes(part) ? <strong key={idx}>{part}</strong> : part
        );
    }

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
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
            {summaryItems.map((item, idx) => (
                <div key={idx} className="mb-3">
                    <strong className="block mb-1">{item.category}</strong>
                    {item.category === '처리하는 개인정보의 항목'
                    ? highlightMatchedTerms(item.summary_content, userPrivacyItems)
                    : item.summary_content.split('\n').map((line, i) => (
                        <p key={i} className="m-0 p-0 leading-snug">{line}</p>
                        ))}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
