import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';  // 설정 아이콘 이미지
import HomeIcon from '../assets/home-button.png';   // 홈 아이콘 이미지
import AddIcon from '../assets/add-button.png';     // 더보기 버튼 이미지

export default function SettingPageEntry() {
  const navigate = useNavigate();

  return (
    <div className="w-[360px] h-[420px] mx-auto mt-20 bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center justify-center">
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 설정 버튼 */}
      <button 
        className="bg-primary w-20 h-20 rounded-full flex items-center justify-center shadow-md hover:bg-primary/80 transition mb-4"
        onClick={() => navigate('/setting')}
      >
        <img src={SetIcon} alt="Setting" className="w-10 h-10" />
      </button>

      {/* 홈 버튼 */}
      <button 
        className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center shadow-md hover:bg-secondary/80 transition"
        onClick={() => navigate('/')}
      >
        <img src={HomeIcon} alt="Home" className="w-10 h-10" />
      </button>

      {/* 추가로 더 보고 싶은 항목 버튼 */}
      <div className="text-sm font-medium text-gray-700 mb-2">
        추가로 더 보고싶은 개인정보처리방침 항목을 선택해주세요.
      </div>
      <button 
        className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition"
        onClick={() => navigate('/setting/settingaddphrase')}
      >
        <img src={AddIcon} alt="Add Phrase" className="w-8 h-8" />
      </button>

      {/* 수집항목 선택 버튼 */}
      <div className="text-sm font-medium text-gray-700 mb-2">
        제공하고 싶지 않은 수집항목을 선택해주세요.
      </div>
      <button 
        className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 transition"
        onClick={() => navigate('/setting/settingaddprivacy')}
      >
        <img src={AddIcon} alt="Add Privacy" className="w-8 h-8" />
      </button>

    </div>
  );
}
