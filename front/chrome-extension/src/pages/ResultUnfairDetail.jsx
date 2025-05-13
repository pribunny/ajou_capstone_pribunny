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


  return (
    <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
      {/* 상단 타이틀 */}
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 상단 버튼 영역 */}
      <div className="flex justify-center gap-4 mb-2">
        <button onClick={() => navigate('/setting')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={SetIcon} alt="Setting" className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={HomeIcon} alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* 뒤로가기 버튼 - 이미지 사용 */}
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-3"
      >
      <img src={BackIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      {/* 독소조항 상세내용 영역 */}
      <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap text-left">

        {unfairItems.map((item, idx) => (
          <div key={idx}>
            <strong>{item.category}</strong><br />
            {item.detect_content}
          </div>
        ))}
      </div>
    </div>
  );
}
