/* global chrome */
import {React, useEffect} from 'react';
import { createRoot } from 'react-dom/client'; // ✅ 이거 반드시 있어야 함
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import MainImg from '../assets/main_bunny.png';
import App from '../App'; // 이 App에 모든 Route가 정의되어 있음

// const root = createRoot(document.getElementById('root'));

// root.render(
//   <MemoryRouter initialEntries={['/']}>
//     <App />
//   </MemoryRouter>
// );

export default function Popup() {
    const navigate = useNavigate();
    console.log("[Popup] : 실행됨");

    return (
        <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
        
        <div className="relative flex items-center justify-center h-[40px]">
        {/* 설정 버튼 */}
        <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
            <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
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
        {/* ✅ 구분선 */}
        <div className="w-full h-[1px] bg-black" />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col justify-center items-center">
            <img src={MainImg} alt="Pribunny" className="w-[278px] h-[189px] mt-8 mb-8" />
            {/* <div className="text-center text-sm mb-12 font-serif">
            <p>우리의 똑똑한 토끼가 탐색을 도와줄거예요.</p>
            <p>개인정보처리방침, 수집이용동의서 내용 확인하기</p>
            </div> */}
            <button
            className="w-[211px] h-[61px] bg-white text-[22px] font-extrabold font-['Noto_Sans'] rounded-[20px] shadow-md hover:bg-gray-100 transition"
            onClick={() => navigate('/start')}
            >
            Start
            </button>
        </div>
        </div>
  );

}
