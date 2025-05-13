/* global chrome */
import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import MainImg from '../assets/main_bunny.jpg';

export default function Popup() {
    const navigate = useNavigate();
    console.log("이건 실행되냐?1");

    useEffect(() => {
        // 현재 탭에 메시지 보내기
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "give_full_data" });
        });

        // 응답 받을 리스너
        const handleMessage = (request) => {
            if (request.action === "take_full_data") {
                console.log("✅ 받은 텍스트:", request.source);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    console.log("이건 실행되냐?2");
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

