import React from "react";

const Declare = ({ onClose }) => {
    const URL = "https://privacy.kisa.or.kr/counsel/privacy/report_step00.do";

    return(
        <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
        {/* ✅ 상단 타이틀 & 버튼 */}
            <div className="relative flex items-center justify-center h-[40px]">
                <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
                    침해신고
                </h2>
                {/* 닫기 버튼 */}
                <button onClick={onClose}
                    className="w-[31px] h-[31px] bg-transparent absolute right-0 font-['Noto_Sans'] text-xl flex items-center justify-center">
                    X
                </button>
            </div>

        {/* ✅ 구분선 */}
        <div className="w-full h-[1px] bg-black mb-2" />
            <div className="w-full flex-1 overflow-y-auto mt-2 px-1">

            {/* 신고 버튼 */}
                <div className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center mb-2">
                    <a href = {URL} target="_blank">
                        신고 바로가기
                    </a>
                </div>
            {/* 법적 효력이 없다는 문구*/}
                <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
                    <p className="mb-1">
                        <strong>
                            탐지 결과는 참고용으로, 법적 효력이 존재하지 않습니다. 신고를 하는 경우 조항을 꼼꼼하게 읽은 후 진행해주세요.
                        </strong>
                    </p>
                </div>
            {/* 기타 신고 방법 */}
                <div className="w-[100px] h-[35px] bg-yellow-02 rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center mb-2">
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

export default Declare;