import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/home-button.png';
import { getSummarize } from '../services/summary';
import { getUnfairDetect } from '../services/unfair'; // ✅ 필요

import DOMPurify from 'dompurify'; // XSS 방지를 위함 -> npm install dompurify 해야됩니당
import Loading from '../components/Loading';
import ShowError from '../components/ShowError';

// 여기 새로고침하면 서버로 계속 데이턱 ㅏ전송되는 오류는?
export default function ResultPage() {
    const navigate = useNavigate();

    const [htmlSource, getHtmlSource] = useState("");
    const [summaryId, setSummaryId] = useState("");
    const [summaryItems, setSummaryItems] = useState([]);
    const [unfairId, setUnfairId] = useState("");
    const [unfairItems, setUnfairItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]); //테스트용으로 일부러 넣음여

    useEffect(() => { //html 데이터 불러오는 부분

    }, [htmlSource]); //이거 추가해서 htmlSource가 생성되면 실행되도록 한다.


    return (
        <div className="bg-yellow-01 min-h-screen flex flex-col items-center  px-4">
            {errorMessage.length !== 0 ? (
                <ShowError message={errorMessage} />
            ) : (unfairItems.length === 0 || summaryItems.length === 0 ? (
                <Loading />
            ) : (
                <div className="w-full max-w-5xl py-10">
                    {/* 헤더 - pribunny, 홈 버튼 */}
                    <div className="w-full max-w-5xl mx-auto relative flex justify-center items-center mb-6">
                        <h2 className="text-3xl font-bold">PRIBUNNY</h2>
                        <button onClick={() => navigate('/')} className="absolute right-0">
                            <img src={HomeIcon} alt="home_icon" className="w-8 h-8" />
                        </button>
                    </div>

                    {/* 결과 출력 부분 */}
                    <div className="bg-yellow-02 rounded-2xl p-6 space-y-6">
                        {/* 독소조항 탐지 출력 */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-left">불공정 조항 탐지 결과</h3>
                            <div className="bg-white rounded-2xl p-4">
                                {unfairItems.length > 0 ? (
                                    unfairItems.map((item, idx) => (
                                        <div key={idx} className="mb-3 text-left">
                                            <strong>{item.category}</strong><br />
                                            {item.detect_content}
                                        </div>
                                    ))
                                ) : (
                                    <div>탐지된 항목이 없습니다.</div>
                                )}
                            </div>
                        </div>

                        {/* 요약 출력 */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-left">요약 결과</h3>
                            <div className="bg-white rounded-2xl p-4">
                                {summaryItems.map((item, idx) => (
                                    <div key={idx} className="mb-3 text-left">
                                        <strong>{item.category}</strong><br />
                                        {item.summary_content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

