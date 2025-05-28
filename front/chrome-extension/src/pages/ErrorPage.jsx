import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/home-button.png';
import SetIcon from '../assets/setting-button.png';
import BunnyImage from '../assets/realized_bunny.png'; // 🐰 이미지 경로

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { source, code, message } = location.state || {
    source: '알 수 없음',
    code: 'NO_ERROR',
    message: '에러 정보가 전달되지 않았습니다.',
  };

  return (
    <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
    
    {/* 🔝 상단 타이틀 + 버튼 */}
    <div className="relative flex items-center justify-center h-[40px]">
      {/* 설정 버튼 */}
      <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
          <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
      </button>

      {/* 제목 */}
      <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
          PRIBUDDY
      </h2>

      {/* 홈 버튼 */}
      <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
          <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
      </button>
    
    </div>

    {/* ✅ 구분선 */}
    <div className="w-full h-[1px] bg-black" />

    {/* 🐰 중앙 에러 메시지 및 이미지 */}
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 text-center z-10">
      <img
        src={BunnyImage}
        alt="깨달은 토끼"
        className="absolute w-[309px] opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <div className="z-10 text-black font-['Noto_Sans']">
        <p className="text-[16px] font-bold mb-2">분석 중 오류가 발생했습니다...</p>
        <p className="text-[15px]">홈 버튼을 눌러 다시 시도해주세요!</p>
      </div>
    </div>
  </div>
  );
}
