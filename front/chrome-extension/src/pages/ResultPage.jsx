import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import { getSummarize } from '../services/summary';
import { getUnfairDetect } from '../services/unfair'; // ✅ 필요

import DOMPurify from 'dompurify'; // XSS 방지를 위함 -> npm install dompurify 해야됩니당
import Loading from '../components/Loading';


export default function ResultPage() {
    const navigate = useNavigate();
    const [htmlSource, getHtmlSource] = useState("");
    const [summaryId, setSummaryId] = useState("");
    const [summaryItems, setSummaryItems] = useState([]);
    const [unfairId, setUnfairId] = useState("");
    const [unfairItems, setUnfairItems] = useState([]);
    const [userPrivacyItems, setUserPrivacyItems] = useState([]);
    const [wantedPhrases, setWantedPhrases] = useState([]);

    // ✅ 공통 입력 텍스트 한 번만 선언
    const testText = `
    여기에 테스트용 개인정보처리방침 또는 약관 내용을 작성하세요.
    `;

    useEffect(() => { //html 데이터 불러오는 부분
        // 현재 탭에 메시지 보내기
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "give_full_data" });
        });

        // 응답 받을 리스너
        const handleMessage = (request) => {
            if (request.action === "take_full_data") {
                console.log("[ResultPage]받은 텍스트:", request.source);
                getHtmlSource(request.source);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);

    }, []);

    useEffect(() => { //서버로부터 데이터 불러오는 부분
        if (!htmlSource){
             console.log('HTML 데이터 없음');
             return;
        }

        const cleanHTML = DOMPurify.sanitize(htmlSource); // 데이터를 한 번 정제해서 보낸다.
        console.log('정제된 데이터 : ', cleanHTML);

        // const loadSummary = async () => {
        //     try {
        //         const data = await getSummarize(cleanHTML, 'long');
        //         console.log(data.summaryItems);
        //         setSummaryId(data.summaryId);
        //         setSummaryItems(data.summaryItems);
        //     } catch (error) {
        //         // 에러 핸들링 -> 에러 코드를 출력하면 됨.
        //         console.error('요약실패', error);
        //     }
        // };
        const loadSummary = async () => {
            try {
                const data = await getSummarize(cleanHTML, 'long');
                setSummaryId(data.summaryId);
                setSummaryItems(data.summaryItems);
            } catch (error) {
                console.error('요약실패', error);
                navigate('/error', {
                state: {
                    source: '요약 처리',
                    code: error.code || 'UNKNOWN',
                    message: error.message || '알 수 없는 에러가 발생했습니다.'
                }
                });
            }
            };

        // const loadUnfair = async () => {
        //     try {
        //         const data = await getUnfairDetect(cleanHTML, 'long');
        //         console.log(data.unfairItems);
        //         setUnfairId(data.unfairId);
        //         setUnfairItems(data.unfairItems);
        //     } catch (error) {
        //         // 에러 핸들링 -> 에러 코드를 출력하면 됨.
        //         console.error('불공정약관탐지실패', error);
        //     }
        // };

        const loadUnfair = async () => {
        try {
            const data = await getUnfairDetect(cleanHTML, 'long');
            setUnfairId(data.unfairId);
            setUnfairItems(data.unfairItems);
        } catch (error) {
            console.error('불공정약관탐지실패', error);
            navigate('/error', {
            state: {
                source: '불공정약관 탐지',
                code: error.code || 'UNKNOWN',
                message: error.message || '알 수 없는 에러가 발생했습니다.'
            }
            });
        }
        };

        loadSummary();
        loadUnfair(); // 함수 이름도 맞춰서 호출
    }, [htmlSource]); //이거 추가해서 htmlSource가 생성되면 실행되도록 한다.

    // // ✅ 요약 데이터 로딩
    // useEffect(() => {
    //     const loadSummary = async () => {
    //     try {
    //         const data = await getSummarize(testText, 'short');
    //         setSummaryId(data.summaryId);
    //         setSummaryItems(data.summaryItems);
    //     } catch (error) {
    //         console.error('요약 실패', error);
    //     }
    //     };
    //     loadSummary();
    // }, []);

    // // ✅ 불공정 약관 탐지 로딩
    // useEffect(() => {
    //     const loadUnfair = async () => {
    //     try {
    //         const data = await getUnfairDetect(testText, 'short');
    //         setUnfairId(data.unfairId);
    //         setUnfairItems(data.unfairItems);
    //     } catch (error) {
    //         console.error('불공정약관 탐지 실패', error);
    //     }
    //     };
    //     loadUnfair();
    // }, []);

    useEffect(() => {
    chrome.storage.local.get(['privacySelections'], (result) => {
        if (result.privacySelections?.items) {
        setUserPrivacyItems(result.privacySelections.items);
        }
    });
    }, []);

    function highlightMatchedTerms(text, terms) {
    if (!terms || terms.length === 0) return text;

    const pattern = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(pattern);

    return parts.map((part, idx) =>
        terms.includes(part) ? <strong key={idx}>{part}</strong> : part
    );
    }

    useEffect(() => {
    chrome.storage.local.get(['wantedPhrases'], (result) => {
        console.log('✔ wantedPhrases (from storage):', result.wantedPhrases);
        console.log('✔ summaryItems.map(c):', summaryItems.map(s => s.category));
        if (result.wantedPhrases) {
        setWantedPhrases(result.wantedPhrases);
        }
    });
    }, []);


    // return (
    //     <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
    //         <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>
    //         {(unfairItems.length === 0 || summaryItems.length === 0) ? (
    //             <Loading />
    //             ):
    //             (
    //                 <>
    //                     {/* 상단 버튼 */}
    //                     <div className="flex justify-center gap-4 mb-4">
    //                         <button onClick={() => navigate('/setting')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
    //                             <img src={SetIcon} alt="Setting" className="w-6 h-6" />
    //                         </button>
    //                         <button onClick={() => navigate('/')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
    //                             <img src={HomeIcon} alt="Home" className="w-6 h-6" />
    //                         </button>
    //                     </div>

    //                     {/* 더보기 버튼 */}
    //                     <div className="flex justify-between items-center mb-2">
    //                         <span className="text-sm font-semibold">불공정약관</span>
    //                         <button
    //                         className="text-sm text-blue-600 hover:underline"
    //                         onClick={() => navigate('resultdetail', {
    //                         state: {
    //                             unfairId,
    //                             unfairItems
    //                         }})
    //                         }>
    //                             더보기
    //                         </button>
    //                     </div>

    //                     {/* 독소 조항 출력 영역 (내용 없음) */}
    //                     <div className="border rounded-lg h-24 text-sm flex items-center px-2 whitespace-pre-wrap text-left">
    //                         {unfairItems.length > 0 && (
    //                             <p>
    //                                 <strong>
    //                                     {unfairItems.map(item => item.category).join(', ')}
    //                                 </strong>
    //                                 {" 에서 불공정약관을 찾았습니다!"}
    //                             </p>
    //                         )}
    //                     </div>

    //                     {/* 요약 제목 */}
    //                     <div className="flex justify-between items-center mb-2">
    //                         <span className="text-sm font-semibold">요약</span>
    //                     </div>
    //                     {/* 요약 출력 영역 */}
    //                     <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap text-left">
    //                         <br />

    //                         {/* {summaryItems.map((item, idx) => (
    //                         <div key={idx} className="mb-3">
    //                             <strong>{item.category}</strong><br />
    //                             {item.summary_content}
    //                         </div>
    //                         ))} */}
    //                         {summaryItems.map((item, idx) => (
    //                         <div key={idx} className="mb-3">
    //                             <strong>{item.category}</strong><br />
    //                             {item.category === '처리하는 개인정보 항목'
    //                             ? highlightMatchedTerms(item.summary_content, userPrivacyItems)
    //                             : item.summary_content}
    //                         </div>
    //                         ))}
    //                     </div>
    //                 </>
    //             )}
    //     </div>
    // );

    return (
        <div className="w-[360px] h-[500px] mx-auto mt-4 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        <h2 className="text-center text-xl font-bold mb-2">PRIBUNNY</h2>
        {(unfairItems.length === 0 || summaryItems.length === 0) ? (
                <Loading />
                ):
                (
                    <>

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
            onClick={() => navigate('resultdetail', {
            state: {
                unfairId,
                unfairItems
                }})
            }>
                 더보기
             </button>
        </div>

        {/* 독소 조항 출력 영역 (내용 없음) */}
        <div className="border rounded-lg h-24 text-sm flex items-center px-2 whitespace-pre-wrap text-left">
            {unfairItems.length > 0 && (
                <p>
                    <strong>
                        {unfairItems.map(item => item.category).join(', ')}
                    </strong>
                    {" 에서 불공정약관을 찾았습니다!"}
                </p>
            )}
        </div>

        {/* 요약 */}
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">요약</span>
        </div>
            {/* <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap text-left">
                <br />
                {summaryItems.map((item, idx) => (
                <div key={idx} className="mb-3">
                    <strong>{item.category}</strong><br />
                    {item.category === '처리하는 개인정보 항목'
                    ? highlightMatchedTerms(item.summary_content, userPrivacyItems)
                    : item.summary_content}
                </div>
                ))}
            </div> */}
            <div className="border rounded-lg p-2 h-40 overflow-y-auto text-sm whitespace-pre-wrap text-left">
            {summaryItems
                // .filter(item =>
                // item.category === '개인정보 처리 목적' ||
                // item.category === '처리하는 개인정보 항목' ||
                // wantedPhrases.includes(item.category)
                // )
                .filter(item =>
                ['개인정보의 처리 목적', '처리하는 개인정보의 항목'].includes(item.category.trim()) ||
                wantedPhrases.some(phrase =>
                    item.category.trim().normalize() === phrase.trim().normalize()
                )
                )
                .map((item, idx) => (
                <div key={idx} className="mb-3">
                    <strong>{item.category}</strong><br />
                    {item.category === '처리하는 개인정보의 항목'
                    ? highlightMatchedTerms(item.summary_content, userPrivacyItems)
                    : item.summary_content}
                </div>
                ))}
            </div>
         </>
                )}
        </div>
    );
}
