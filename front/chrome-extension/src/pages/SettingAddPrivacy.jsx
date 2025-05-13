import React, { useState } from 'react';
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


  const handleCheckboxChange = (item) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSave = () => {
    alert(`선택된 항목: ${selectedItems.join(', ')}`);
  };

  return (
    <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 상단 버튼 */}
      <div className="flex justify-center gap-4 mb-2">
        <button onClick={() => navigate('/setting')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={BackIcon} alt="Back" className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={HomeIcon} alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* 드롭다운 */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm mb-2"
      >
        <option value="기본">기본적인 수집 항목</option>
        <option value="신체정보">신체적 정보 및 정신적 정보</option>
        <option value="인적사항">인적사항 및 기타정보</option>
        <option value="사회정보">사회적 정보</option>
        <option value="재산정보">재산적 정보</option>
      </select>

      {/* 기본 항목 렌더링 */}
      {selectedCategory === '기본' && (
        <div className="border rounded-lg p-3 h-40 overflow-y-auto text-sm mb-3 grid grid-cols-2 gap-x-4">
          {[
            '성명', '생년월일', '이메일 주소', '주소', '카드 번호', '생체 정보', '휴대폰 번호', '성별','주민등록번호', '위치 정보', '계좌 번호', '출생지'
          ].map(item => (
            <label key={item} className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* ✅ 사용자 추가 항목
          {(customInputs[selectedCategory] || []).map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setInputVisible(true)}
          >
            ＋ 수집 항목 추가
          </button> */}

          {/* 입력창: visible 상태일 때만 표시
          {inputVisible && (
            <input
              type="text"
              className="border px-2 py-1 text-sm rounded w-full mt-1 mb-2"
              placeholder="항목 입력 후 Enter"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  setCustomInputs(prev => ({
                    ...prev,
                    [selectedCategory]: [...(prev[selectedCategory] || []), currentInput.trim()]
                  }));
                  setCurrentInput('');
                  setInputVisible(false);
                }
              }}
            />
          )} */}
        </div>
      )}

      {/* 신체적 정보 및 정신적 정보 항목 렌더링 */}
      {selectedCategory === '신체정보' && (
        <div className="border rounded-lg p-3 h-40 overflow-y-auto text-sm mb-3">
          {/* ✅ 사용자 추가 항목
          {(customInputs[selectedCategory] || []).map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setInputVisible(true)}
          >
            ＋ 수집 항목 추가
          </button> */}

          {/* 입력창: visible 상태일 때만 표시
          {inputVisible && (
            <input
              type="text"
              className="border px-2 py-1 text-sm rounded w-full mt-1 mb-2"
              placeholder="항목 입력 후 Enter"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  setCustomInputs(prev => ({
                    ...prev,
                    [selectedCategory]: [...(prev[selectedCategory] || []), currentInput.trim()]
                  }));
                  setCurrentInput('');
                  setInputVisible(false);
                }
              }}
            />
          )} */}
          <h3 className="font-semibold mb-1">의료·건강 정보</h3>
          {['건강상태', '진료기록', '병력', '신체장애', '장애등급'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}
          

          <h3 className="font-semibold mb-1">기호·성향 정보</h3>
          {['구매내역', '검색내역'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          <h3 className="font-semibold mb-1">내면의 비밀 정보</h3>
          {['종교', '정당·노조 가입여부 및 활동내역'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm hover:underline">＋ 수집 항목 추가</button> */}
        </div>
      )}

      {/* 사회적 정보 항목 렌더링 */}
      {selectedCategory === '인적사항' && (
        <div className="border rounded-lg p-3 h-40 overflow-y-auto text-sm mb-3">
          {/* ✅ 사용자 추가 항목
          {(customInputs[selectedCategory] || []).map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setInputVisible(true)}
          >
            ＋ 수집 항목 추가
          </button> */}

          {/* 입력창: visible 상태일 때만 표시
          {inputVisible && (
            <input
              type="text"
              className="border px-2 py-1 text-sm rounded w-full mt-1 mb-2"
              placeholder="항목 입력 후 Enter"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  setCustomInputs(prev => ({
                    ...prev,
                    [selectedCategory]: [...(prev[selectedCategory] || []), currentInput.trim()]
                  }));
                  setCurrentInput('');
                  setInputVisible(false);
                }
              }}
            />
          )} */}
          <h3 className="font-semibold mb-1">가족 정보</h3>
          {['가족관계 및 가족구성원 정보', '법정대리인정보'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          <h3 className="font-semibold mb-1">통신 정보</h3>
          {['로그 파일', '쿠키'].map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm hover:underline">＋ 수집 항목 추가</button> */}
        </div>
      )}

      {/* 신체정보 항목 렌더링 */}
      {selectedCategory === '사회정보' && (
        <div className="border rounded-lg p-3 h-40 overflow-y-auto text-sm mb-3">
          {/* 교육 정보 */}
          {/* ✅ 사용자 추가 항목
          {(customInputs[selectedCategory] || []).map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setInputVisible(true)}
          >
            ＋ 수집 항목 추가
          </button> */}

          {/* 입력창: visible 상태일 때만 표시
          {inputVisible && (
            <input
              type="text"
              className="border px-2 py-1 text-sm rounded w-full mt-1 mb-2"
              placeholder="항목 입력 후 Enter"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  setCustomInputs(prev => ({
                    ...prev,
                    [selectedCategory]: [...(prev[selectedCategory] || []), currentInput.trim()]
                  }));
                  setCurrentInput('');
                  setInputVisible(false);
                }
              }}
            />
          )} */}
          <h3 className="font-semibold mb-1">교육 정보</h3>
          {['학력', '성적', '기술 자격증 및 전문 면허증 보유 내역'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          {/* 병역 정보 */}
          <h3 className="font-semibold mb-1">병역 정보</h3>
          {['병역여부', '군번 및 계급'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          {/* 근로 정보 */}
          <h3 className="font-semibold mb-1">근로 정보</h3>
          {['직장', '고용주', '근무처', '근로경력'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          {/* 법적 정보 */}
          <h3 className="font-semibold mb-1">법적 정보</h3>
          {['전과·범죄 기록', '과태료 납부내역'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm hover:underline">＋ 수집 항목 추가</button> */}
        </div>
      )}

      {selectedCategory === '재산정보' && (
        <div className="border rounded-lg p-3 h-40 overflow-y-auto text-sm mb-3">
          {/* ✅ 사용자 추가 항목
          {(customInputs[selectedCategory] || []).map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setInputVisible(true)}
          >
            ＋ 수집 항목 추가
          </button> */}

          {/* 입력창: visible 상태일 때만 표시
          {inputVisible && (
            <input
              type="text"
              className="border px-2 py-1 text-sm rounded w-full mt-1 mb-2"
              placeholder="항목 입력 후 Enter"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  setCustomInputs(prev => ({
                    ...prev,
                    [selectedCategory]: [...(prev[selectedCategory] || []), currentInput.trim()]
                  }));
                  setCurrentInput('');
                  setInputVisible(false);
                }
              }}
            />
          )} */}
          {/* 소득 정보 */}
          <h3 className="font-semibold mb-1">소득 정보</h3>
          {['봉급액', '이자소득', '사업소득'].map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          {/* 신용 정보 */}
          <h3 className="font-semibold mb-1">신용 정보</h3>
          {['대출 정보', '신용평가 정보'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button> */}

          {/* 부동산 정보 */}
          <h3 className="font-semibold mb-1">부동산 정보</h3>
          {['소유주택', '토지', '사업소득'].map(item => (
            <label key={item} className="inline-flex items-center mr-4 mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <div><button className="text-blue-500 text-sm mb-2 hover:underline">＋ 수집 항목 추가</button></div> */}

          {/* 기타 수익 정보 */}
          <h3 className="font-semibold mb-1">기타 수익 정보</h3>
          {['보험'].map(item => (
            <label key={item} className="block mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedItems.includes(item)}
                onChange={() => handleCheckboxChange(item)}
              />
              {item}
            </label>
          ))}
          {/* <button className="text-blue-500 text-sm hover:underline">＋ 수집 항목 추가</button> */}
        </div>
      )}



      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto shadow hover:bg-blue-600 transition"
      >
        <img src={SaveIcon} alt="저장하기" className="w-8 h-8" />
      </button>
    </div>
  );
}
