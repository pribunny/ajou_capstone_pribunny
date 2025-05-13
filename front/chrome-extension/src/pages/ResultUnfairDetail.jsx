import React from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import BackIcon from '../assets/back-button.png';

export default function ResultUnfairDetail() {
  const navigate = useNavigate();

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
      <div className="border border-gray-300 rounded-lg p-3 h-full overflow-y-auto text-sm">
        {/* 이곳에 실제 내용이 출력됩니다 */}
        <p className="mb-3">
          개인정보 파기 항목에<br />
          <strong>파기의 절차, 방법 등에 관한 세부적인 내용</strong><br />
          이 작성되어 있지 않습니다!
        </p>

        <p>
          개인정보 제3자제공 항목에<br />
          <strong>제3자의 이용목적, 제공하는 개인정보 항목</strong><br />
          이 작성되어 있지 않습니다!
        </p>
      </div>
    </div>
  );
}
