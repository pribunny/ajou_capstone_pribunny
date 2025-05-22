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

        console.log("fjeirfjifj ", htmlSource);
        console.log("fjeirfjifj ", htmlSource.html);
        const cleanHTML = DOMPurify.sanitize(htmlSource.html); // 데이터를 한 번 정제해서 보낸다. + 수정함
        console.log('정제된 데이터 : ', cleanHTML);
        const cleanText = DOMPurify.sanitize(htmlSource.text); //추가함
        console.log('정제된 데이터 : ', cleanText); //추가함

        const cleanData = { //추가함
            html : cleanHTML,
            text : cleanText
        };

        const loadSummary = async () => {
            try {
                const data = await getSummarize(cleanData, 'long'); //수정
                setSummaryId(data.summaryId);
                // setSummaryId(data.documentId);

                setSummaryItems(data.summaryItems);

                // const flatSummaryItems = data.results.flatMap(result =>
                //     result.summaryItems.map(item => ({
                //         category: item.category_name,
                //         summary_content: item.summarize_content
                //     }))
                // );
                // const flatSummaryItems = (data.results || []).flatMap(result =>
                //     (result.summaryItems[0] || []).map(item => ({
                //         category: item.category_name,
                //         summary_content: item.summarize_content
                //     }))
                // );


                // setSummaryItems(flatSummaryItems);
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

        const loadUnfair = async () => {
        try {
            const data = await getUnfairDetect(cleanData, 'long'); //수정
            setUnfairId(data.unfairId);
            // setUnfairId(data.documentId || '');

            setUnfairItems(data.unfairItems);
            // const flatUnfairItems = data.results.map(result => ({
            //     category: result.category,
            //     ...result.detectItems
            // }));

            // setUnfairItems(flatUnfairItems);
            // setUnfairItems(data.results || []);
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

    // 스토리지에서 개인정보 항목 가져오는 함수
    useEffect(() => {
    chrome.storage.local.get(['privacySelections'], (result) => {
        if (result.privacySelections?.items) {
        setUserPrivacyItems(result.privacySelections.items);
        }
    });
    }, []);

    // 개인정보 항목 표시하는 함수
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

    return (
        <div className="w-[360px] h-[460px] mx-auto bg-[#FFFDEB] rounded-2xl shadow-lg p-4 flex flex-col">
        {/* ✅ 상단 타이틀 & 버튼 */}
        <div className="relative flex items-center justify-center h-[40px]">
        <button onClick={() => navigate('/setting')} className="absolute left-0 w-[26px] h-[26px]">
            <img src={SetIcon} alt="Setting" className="w-[26px] h-[26px]" />
        </button>
        <h2 className="text-[18px] font-bold font-['Noto_Sans'] text-center">
            PRIBUNNY
        </h2>
        <button onClick={() => navigate('/')} className="absolute right-0 w-[26px] h-[26px]">
            <img src={HomeIcon} alt="Home" className="w-[26px] h-[26px]" />
        </button>
        </div>

        {/* ✅ 구분선 */}
        <div className="w-full h-[1px] bg-black mb-2" />

        {(unfairItems.length === 0 || summaryItems.length === 0) ? (
                <Loading />
                ):
                (
                    <>


        {/* 스크롤 가능한 공통 출력 영역 */}
        <div className="w-full flex-1 overflow-y-auto mt-2 px-1">

        {/* 불공정약관 타이틀 + 더보기 */}
        <div className="flex justify-between items-center mb-2">
            <span className="w-[100px] h-[35px] bg-[#FFFBCA] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center">
            불공정 약관
            </span>
            <button
            onClick={() => navigate('resultdetail', {
                state: { unfairId, unfairItems }
            })}
            className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#f7c8cc] transition"
            >
            더보기
            </button>
        </div>

        {/* 불공정약관 내용 */}
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-5">
            {unfairItems.length > 0 && (
            <p>
                <strong>{unfairItems.map(item => item.category).join(', ')}</strong>
                {" 에서 불공정약관을 찾았습니다!"}
            </p>
            )}
        </div>

        {/* 요약 제목 */}
        <div className="flex justify-between items-center mb-2">
            <span className="w-[100px] h-[35px] bg-[#FFFBCA] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center">
            요약
            </span>
            <button
                onClick={() => navigate('resultsummarydetail', {
                    state: { summaryId, summaryItems }
                })}
                className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#bdd8fc] transition"
            >
                더보기
            </button>
        </div>

        {/* 요약 내용 */}
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
            {summaryItems
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
        </div>
         </>
                )}
        </div>
    );
}