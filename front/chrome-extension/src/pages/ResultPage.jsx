import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';

export default function ResultPage() {
  const navigate = useNavigate();

  return (
    <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
      <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>

      {/* 상단 버튼 */}
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => navigate('/setting')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={SetIcon} alt="Setting" className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <img src={HomeIcon} alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* 더보기 버튼 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">불공정약관</span>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => navigate('resultdetail')}
        >
          더보기
        </button>
      </div>
      
      {/* 독소 조항 출력 영역 (내용 없음) */}
      <div className="border rounded-lg p-2 mb-4 h-24 overflow-y-auto text-sm">
        {/* 독소 조항 텍스트 출력 영역 (비워둠) */}
        <span className="text-blue-600 font-semibold">
            개인정보 파기, 개인정보 제3자제공
        </span>
        에서 독소조항으로 의심되는 조항을 찾았어요!!<br />
        클릭해서 해당 내용을 확인해보세요!
      </div>

      {/* 요약 제목 */}
      <div className="mb-1">
      <span className="text-sm font-semibold">요약</span>
      </div>

      {/* 요약 출력 영역 */}
      <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap">
      {/* 요약 텍스트 출력 영역 (비워둠) */}
      <p>1. 개인정보 수집 목적<br />
      계정 가입, 본인인증, 법정대리인 동의, 고객 상담을 위해 개인정보를 수집합니다 !</p>
      <br />
      <p>2. 수집하는 개인정보 항목<br />
      이름, 이메일, 생년월일, 주소 등</p>
      </div>
    </div>
  );
}
