import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import BackIcon from '../assets/back-button.png';
import SaveIcon from '../assets/save-button.png';

export default function SettingAddPhrase() {
  const navigate = useNavigate();
  const [selectedPhrases, setSelectedPhrases] = useState([]);

  // 선택 가능한 항목 목록
  const phrases = [
    '14세 미만 아동의 개인정보 처리에 관한 사항',
    '개인정보 처리 및 보유기간',
    '개인정보의 파기 절차 및 방법에 관한 사항',
    '개인정보의 제3자 제공에 관한 사항',
    '추가적인 이용·제공이 지속적으로 발생 시 판단 기준',
    '개인정보의 처리업무의 위탁에 관한 사항',
    '개인정보 국외 수집 및 이전에 관한 사항',
    '개인정보의 안전성 확보조치에 관한 사항',
    '민감정보의 공개 가능성 및 비공개를 선택하는 방법',
    '가명정보 처리에 관한 사항',
    '개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항',
    '개인정보를 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집·이용 및 거부에 관한 사항',
    '정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항',
    '개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항',
    '국내대리인 지정에 관한 사항',
    '정보주체의 권익침해에 대한 구제방법',
    '고정형 영상정보처리기기 운영·관리에 관한 사항',
    '이동형 영상정보처리기기 운영·관리에 관한 사항',
    '개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항',
    '개인정보 처리방침의 변경에 관한 사항',
  ];

  // ✅ 저장된 선택 항목을 불러오기
  useEffect(() => {
    chrome.storage.local.get(['wantedPhrases'], (result) => {
      if (result.wantedPhrases) {
        setSelectedPhrases(result.wantedPhrases);
      }
    });
  }, []);

  // ✅ 체크 상태 토글
  const togglePhrase = (item) => {
    setSelectedPhrases((prev) =>
      prev.includes(item)
        ? prev.filter((phrase) => phrase !== item)
        : [...prev, item]
    );
  };

  // ✅ 저장
  const handleSave = () => {
    console.log('📌 현재 선택된 항목:', selectedPhrases);
    // if (selectedPhrases.length === 0) {
    //   alert('선택된 항목이 없습니다.');
    //   return;
    // }

    chrome.storage.local.set({ wantedPhrases: selectedPhrases }, () => {
      console.log('✅ 저장된 wantedPhrases:', selectedPhrases);
      alert(`선택된 항목이 저장되었습니다:\n${selectedPhrases.join(', ')}`);
    });
  };

  return (
    <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">

      {/* 상단 바 */}
      <div className="relative flex items-center justify-center h-[40px] mb-1">
        {/* 뒤로가기 */}
        <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
          <img src={BackIcon} alt="Back" className="w-[26px] h-[26px]" />
        </button>

        {/* 제목 */}
        <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
          PRIBUNNY
        </h2>

        {/* 홈 버튼 */}
        <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
          <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
        </button>
      </div>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-black mb-4" />

      {/* 설명 */}
        <p className="mt-6 text-[16px] font-semibold font-['Noto_Sans'] text-center text-gray-700">
          추가로 더 보고 싶은 개인정보처리방침 항목을<br/>
          선택해주세요!
        </p>

        {/* 체크박스 목록 */}
        <div className="mt-10 flex flex-col items-center">
          <div className="w-[328px] h-[188px] border border-gray-300 rounded-none p-3 overflow-y-auto mb-6 text-left bg-white text-[14px] font-medium font-['Noto_Sans']">
            {phrases.map((item) => (
              <label key={item} className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none checked:bg-pink-500 checked:after:content-['✔'] checked:after:block checked:after:text-white checked:after:text-[14px] checked:after:text-center checked:after:leading-[16px]"
                    checked={selectedPhrases.includes(item)}
                    onChange={() => togglePhrase(item)}
                  />
                </div>
                <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className="w-[120px] h-[36px] bg-[#F9D5D9] text-[16px] font-bold font-['Noto_Sans'] rounded-[12px] text-black shadow hover:bg-[#f7c8cc] transition mx-auto"
          >
            저장하기
          </button>
    </div>
  );
}
