/* global chrome */
import {React, useEffect} from 'react';
import { createRoot } from 'react-dom/client'; // ✅ 이거 반드시 있어야 함
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import MainImg from '../assets/main_bunny.jpg';
import App from '../App'; // 이 App에 모든 Route가 정의되어 있음

const root = createRoot(document.getElementById('root'));

root.render(
  <MemoryRouter initialEntries={['/']}>
    <App />
  </MemoryRouter>
);

export default function Popup() {
    const navigate = useNavigate();
    console.log("[Popup] : 실행됨");

    return (
        <div className="w-[360px] h-[460px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
            <div className="flex items-center relative h-[40px]">
                <h2 className="mx-auto text-2xl font-bold">PRIBUNNY</h2>
                <button className="w-10 h-10 bg-gray-200 rounded-full absolute right-0" onClick={() => navigate('/setting')}>
                    <img src = {SetIcon} alt="Setting" className="w-7 h-7 ml-[5px]"/>
                </button>
            </div>
            <div className ="flex-1 flex flex-col justify-center">
                <img className = "w-[230px] h-[220px] mx-auto" src = {MainImg} alt="Pribunny"/>
                <div className="text-center text-sm mb-2 font-serif">
                    <p>우리의 똑똑한 토끼가 탐색을 도와줄거예요.</p>
                    <p>개인정보처리방침, 수집이용동의서 내용 확인하기</p>
                </div>
                <button className = "text-center text-2xl font-bold mb-2 font-serif"
                    onClick={() => navigate('/start')}>
                    Start!
                </button>
            </div>
        </div>
    );
}

