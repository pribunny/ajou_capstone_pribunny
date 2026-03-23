import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '../assets/back-button.png';
import HomeIcon from '../assets/home-button.png';
import SaveIcon from '../assets/save-button.png';

export default function SettingAddPrivacy() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('기본');
  const [selectedItems, setSelectedItems] = useState([]);
  const [customInputs, setCustomInputs] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [inputVisible, setInputVisible] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['privacySelections'], (result) => {
      if (result.privacySelections) {
        setSelectedCategory(result.privacySelections.category || '기본');
        setSelectedItems(result.privacySelections.items || []);
      }
    });
  }, []);


  const handleCheckboxChange = (item) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSave = () => {
  const saveData = {
    category: selectedCategory,
    items: selectedItems,
  };
  chrome.storage.local.set({ privacySelections: saveData }, () => {
    console.log('✅ 저장됨:', saveData);
    alert(`선택된 항목이 저장되었습니다: ${selectedItems.join(', ')}`);
  });
};

  return (
    <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
      {/* 상단 제목 및 버튼 */}
      <div className="relative flex items-center justify-center h-[40px] mb-2">
        {/* Back 버튼 */}
        <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
          <img src={BackIcon} alt="Back" className="w-[26px] h-[26px]" />
        </button>

        {/* 제목 */}
        <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
          PRIBUNNY
        </h2>

        {/* Home 버튼 */}
        <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
          <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
        </button>
      </div>

      {/* 구분선 */}
      <div className="w-full h-[1px] bg-black mb-4" />

      {/* 드롭다운 */}
      <div className="flex justify-center mb-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-[260px] border border-gray-300 rounded px-3 py-2 text-[15px] font-semibold font-['Noto_Sans'] bg-white shadow-sm"
        >
          <option value="기본">기본적인 수집 항목</option>
          <option value="신체정보">신체적 정보 및 정신적 정보</option>
          <option value="인적사항">인적사항 및 기타정보</option>
          <option value="사회정보">사회적 정보</option>
          <option value="재산정보">재산적 정보</option>
        </select>
      </div>

      {/* 기본 항목 렌더링 */}
      {selectedCategory === '기본' && (
        <div className="flex justify-center mt-4 mb-3">
          <div className="w-[312px] h-[209px] bg-white border border-gray-300 rounded-none p-4 overflow-y-auto text-sm mt-4 mb-3 flex flex-col items-start">
            {[
              '이름', '생년월일', '이메일', '주소', '카드 번호', '생체 정보', '휴대폰 번호', '성별','주민등록번호', '위치 정보', '계좌 번호', '출생지'
            ].map(item => (
              <label key={item} className="flex items-center justify-center gap-3 mb-3">
                <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                              checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                              checked:after:text-white checked:after:text-[14px] 
                              checked:after:text-center checked:after:leading-[16px]"
                    checked={selectedItems.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                </div>
                <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
              </label>
            ))}
          </div>
        </div> 
      )}

      {selectedCategory === '신체정보' && (
        <div className="flex justify-center mt-4 mb-3">
          <div className="w-[312px] h-[209px] bg-white border border-gray-300 rounded-none p-4 overflow-y-auto text-sm mt-4 mb-3 flex flex-col items-start">

            {/* 의료·건강 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">의료·건강 정보</h3>
              {['건강상태', '진료기록', '병력', '신체장애', '장애등급'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 기호·성향 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">기호·성향 정보</h3>
              {['구매내역', '검색내역'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 내면의 비밀 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">내면의 비밀 정보</h3>
              {['종교', '정당·노조 가입여부 및 활동내역'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 인적 정보 항목 렌더링 */}
      {selectedCategory === '인적사항' && (
        <div className="flex justify-center mt-4 mb-3">
          <div className="w-[312px] h-[209px] bg-white border border-gray-300 rounded-none p-4 overflow-y-auto text-sm mt-4 mb-3 flex flex-col items-start">
            
            {/* 가족 항목 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">가족 정보</h3>
              {['가족관계 및 가족구성원 정보', '법정대리인정보'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 통신 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">통신 정보</h3>
              {['로그 파일', '쿠키'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 사회정보 항목 렌더링 */}
      {selectedCategory === '사회정보' && (
        <div className="flex justify-center mt-4 mb-3">
          <div className="w-[312px] h-[209px] bg-white border border-gray-300 rounded-none p-4 overflow-y-auto text-sm mt-4 mb-3 flex flex-col items-start">
            
            {/* 교육 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">교육 정보</h3>
              {['학력', '성적', '기술 자격증 및 전문 면허증 보유 내역'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 병역 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">병역 정보</h3>
              {['병역여부', '군번 및 계급'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 근로 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">근로 정보</h3>
              {['직장', '고용주', '근무처', '근로경력'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 법적 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">법적 정보</h3>
              {['전과·범죄 기록', '과태료 납부내역'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ✅ 사용자 추가 항목 */}
      {selectedCategory === '재산정보' && (
        <div className="flex justify-center mt-4 mb-3">
          <div className="w-[312px] h-[209px] bg-white border border-gray-300 rounded-none p-4 overflow-y-auto text-sm mt-4 mb-3 flex flex-col items-start">

            {/* 소득 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">소득 정보</h3>
              {['봉급액', '이자소득', '사업소득'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 신용 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">신용 정보</h3>
              {['대출 정보', '신용평가 정보'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 부동산 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">부동산 정보</h3>
              {['소유주택', '토지', '사업소득'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

            {/* 기타 수익 정보 */}
            <div className="w-full mb-4">
              <h3 className="text-[16px] font-semibold font-['Noto_Sans'] mb-3 text-left">기타 수익 정보</h3>
              {['보험'].map(item => (
                <label key={item} className="flex items-start gap-3 mb-3 w-full">
                  <div className="flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[18px] h-[18px] appearance-none border border-gray-400 rounded-none 
                                checked:bg-pink-500 checked:after:content-['✔'] checked:after:block 
                                checked:after:text-white checked:after:text-[14px] 
                                checked:after:text-center checked:after:leading-[16px]"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  </div>
                  <span className="text-[14px] font-medium font-['Noto_Sans'] leading-snug">{item}</span>
                </label>
              ))}
            </div>

          </div>
        </div>
      )}

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
