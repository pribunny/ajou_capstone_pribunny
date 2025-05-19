import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/home-button.png';
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
    <div className="relative w-[360px] h-[420px] mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center justify-start overflow-hidden">
      {/* 🐰 배경 토끼 이미지 (크게, 흐리게) */}
      <img
        src={BunnyImage}
        alt="Realized Bunny"
        className="absolute w-72 h-72 opacity-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* 제목 */}
      <h2 className="text-xl font-bold mb-2 z-10 mt-2">PRIBUNNY</h2>

      {/* 홈 버튼 (제목 바로 아래) */}
      <button
        className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:bg-secondary/80 transition mb-4 z-10"
        onClick={() => navigate('/')}
      >
        <img src={HomeIcon} alt="Home" className="w-8 h-8" />
      </button>

      {/* 에러 정보 출력 */}
      <div className="z-10 text-sm text-gray-800">
        <h3 className="text-lg font-semibold text-red-600 mb-2">⚠️ 오류 발생</h3>
        <p className="mb-1"><strong>위치:</strong> {source}</p>
        <p className="mb-1"><strong>코드:</strong> {code}</p>
        <p className="whitespace-pre-wrap"><strong>메시지:</strong> {message}</p>
      </div>
    </div>
  );
}
