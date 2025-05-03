/*더 보고 싶은 개인정보처리방침 항목 페이지*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';  // 설정 아이콘 이미지
import HomeIcon from '../assets/home-button.png';   // 홈 아이콘 이미지
import BackIcon from '../assets/back-button.png';     // 더보기 버튼 이미지
import SaveIcon from '../assets/save-button.png'; // 상단에 이미지 추가

export default function SettingPageEntry() {
  const navigate = useNavigate();

  return (
    <div className="w-[360px] h-[420px] mx-auto mt-20 bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center justify-center">
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 버튼 두 개 (뒤로가기, 홈) */}
      <div className="flex justify-center gap-4 mb-2">
        {/* 이전 페이지(설정)으로 */}
        <button 
          className="bg-primary w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-primary/80 transition"
          onClick={() => navigate('/setting')}
        >
          <img src={BackIcon} alt="Back" className="w-6 h-6" />
        </button>

        {/* 홈으로 */}
        <button 
          className="bg-secondary w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-secondary/80 transition"
          onClick={() => navigate('/')}
        >
          <img src={HomeIcon} alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* 설명 텍스트 */}
      <p className="text-sm text-center text-gray-700 mb-2">
        추가로 더 보고 싶은 개인정보처리방침 항목을 선택해주세요!
      </p>

      {/* 체크박스 영역 */}
      <div className="border rounded-lg p-3 h-40 overflow-y-auto mb-4 text-sm">
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          개인정보 제3자 제공
        </label>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          개인정보 처리위탁
        </label>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          개인정보 국외이전
        </label>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          개인정보 파기
        </label>
        <label className="block mb-2">
          <input type="checkbox" className="mr-2" />
          이용자 및 법정대리인의 권리와 행사 방법
        </label>
        <label className="block">
          <input type="checkbox" className="mr-2" />
          개인정보 자동 수집 장치에 관한 사항
        </label>
      </div>

      {/* 저장 버튼 */}
      <button 
        onClick={() => alert('저장되었습니다!')} // 임시 동작
        className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow hover:bg-blue-600 transition"
      >
        <img src={SaveIcon} alt="저장하기" className="w-8 h-8" />
      </button>
    </div>
  );
}
