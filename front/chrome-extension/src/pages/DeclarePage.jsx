import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/home-button.png';
import BackIcon from '../assets/back-button.png';
import SetIcon from '../assets/setting-button.png';
import { useLocation } from 'react-router-dom';

export default function DeclarePage(){
    const navigate = useNavigate();

    const handlePage = () => {

        const url = "https://privacy.kisa.or.kr/counsel/privacy/report_step00.do";

        //backgroun.js로 요청을 보냄.
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.create({ url: url }); //새로운 tab을 열기
            }
        });
    };

    return(
        <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
        {/* ✅ 상단 타이틀 & 버튼 */}
            <div className="relative flex items-center justify-center h-[40px]">
                <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
                    <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
                </button>
                <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
                    PRIBUDDY
                </h2>
                <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
                    <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
                </button>
            </div>

        {/* ✅ 구분선 */}
        <div className="w-full h-[1px] bg-black mb-2" />
            <div className="w-full flex-1 overflow-y-auto mt-2 px-1">
            {/* 뒤로가기 버튼 */}
                <button onClick={() => navigate('/start')}
                    className="w-[31px] h-[31px] bg-transparent flex items-center justify-center mb-3">
                    <img src={BackIcon} alt="뒤로가기" className="w-[31px] h-[31px]" />
                </button>

            {/* 신고하기 버튼 */}
                <button onClick = {handlePage}
                    className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center mb-2">
                    신고 바로가기
                </button>
            {/* 법적 효력이 없다는 문구*/}
                <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
                    <p className="mb-1">
                        <strong>
                            탐지 결과는 참고용으로, 법적 효력이 존재하지 않습니다. 신고를 하는 경우 조항을 꼼꼼하게 읽은 후 진행해주세요.
                        </strong>
                    </p>
                </div>
            {/* 기타 신고 방법 */}
                <div className="w-[100px] h-[35px] bg-[#FFFBCA] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center mb-2">
                    기타 신고 방법
                </div>

                <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
                    <p className="mb-1"> 전화 : 118(국번없이) </p>
                    <p className="mb-1"> 팩스 : 061-820-2619 </p>
                    <p className="mb-1"> 우편 : (58324) 전라남도 나주시 진흥길 9 <br /> 한국인터넷진흥원 3층 개인정보침해신고센터</p>
                    <p className="mb-1"> 방문 : 평일 (09:00 - 18:00) <br /> 전라남도 나주시 진흥길 9 한국인터넷진흥원 3층</p>
                </div>
            </div>
        </div>
    );
};
