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

    // useEffect(() => { //서버로부터 데이터 불러오는 부분
    //     if (!htmlSource){
    //          console.log('HTML 데이터 없음');
    //          return;
    //     }

    //     console.log("fjeirfjifj ", htmlSource);
    //     const cleanHTML = DOMPurify.sanitize(htmlSource.html); // 데이터를 한 번 정제해서 보낸다. + 수정함
    //     console.log('정제된 데이터 : ', cleanHTML);
    //     const cleanText = DOMPurify.sanitize(htmlSource.text); //추가함
    //     console.log('정제된 데이터 : ', cleanText); //추가함

    //     const cleanData = { //추가함
    //         html : cleanHTML,
    //         text : cleanText
    //     };

    //     const loadSummary = async () => {
    //         try {
    //             console.log("summary 데이터 전송 : ", cleanData);
    //             const data = await getSummarize(cleanData, 'long'); //수정
    //             // setSummaryId(data.summaryId);
    //             // setSummaryItems(data.summaryItems);
    //             console.log("load summary 데이터 왔다 : ", data);
    //             const { documentId, results } = data;

    //             setSummaryId(documentId);     // ✅ documentId → summaryId로 저장
    //             setSummaryItems(results);     // ✅ results → summaryItems로 저장

    //         } catch (error) {
    //             console.error('요약실패', error);
    //             navigate('/error', {
    //             state: {
    //                 source: '요약 처리',
    //                 code: error.code || 'UNKNOWN',
    //                 message: error.message || '알 수 없는 에러가 발생했습니다.'
    //             }
    //             });
    //             }
    //         };

    //     const loadUnfair = async () => {
    //     try {
    //         const data = await getUnfairDetect(cleanData, 'long'); //수정
    //         // setUnfairId(data.unfairId);
    //         // setUnfairItems(data.unfairItems);
    //         console.log("load unfair 데이터 왔다 : ", data);
    //         const { documentId, results } = data;

    //         setUnfairId(documentId);        // ← documentId 설정
    //         setUnfairItems(results);        // ← results 설정

    //     } catch (error) {
    //         console.error('불공정약관탐지실패', error);
    //         navigate('/error', {
    //         state: {
    //             source: '불공정약관 탐지',
    //             code: error.code || 'UNKNOWN',
    //             message: error.message || '알 수 없는 에러가 발생했습니다.'
    //         }
    //         });
    //     }
    //     };

    //     loadSummary();
    //     loadUnfair(); // 함수 이름도 맞춰서 호출
    // }, [htmlSource]); //이거 추가해서 htmlSource가 생성되면 실행되도록 한다.
    useEffect(() => {
        if (!htmlSource) {
            console.log('HTML 데이터 없음');
            return;
        }

        // 🛑 이미 summary/unfair 데이터가 sessionStorage에 있으면 다시 요청하지 않음
        const cachedSummary = sessionStorage.getItem('summaryItems');
        const cachedUnfair = sessionStorage.getItem('unfairItems');
        if (cachedSummary && cachedUnfair) {
            console.log('🟢 sessionStorage에 요약/불공정 데이터 존재 → 서버 요청 생략');
            return;
        }

        console.log("📤 HTML source 들어옴, 서버 요청 시작");

        const cleanHTML = DOMPurify.sanitize(htmlSource.html);
        const cleanText = DOMPurify.sanitize(htmlSource.text);
        const cleanData = { html: cleanHTML, text: cleanText };

        const loadSummary = async () => {
            try {
            const data = await getSummarize(cleanData, 'long');
            const { documentId, results } = data;
            setSummaryId(documentId);
            setSummaryItems(results);
            sessionStorage.setItem('summaryItems', JSON.stringify(results));
            sessionStorage.setItem('summaryId', documentId);
            } catch (error) {
            console.error('요약실패', error);
            navigate('/error', {
                state: {
                source: '요약 처리',
                code: error.code || 'UNKNOWN',
                message: error.message || '알 수 없는 에러가 발생했습니다.',
                },
            });
            }
        };

        const loadUnfair = async () => {
            try {
            const data = await getUnfairDetect(cleanData, 'long');
            const { documentId, results } = data;
            setUnfairId(documentId);
            setUnfairItems(results);
            sessionStorage.setItem('unfairItems', JSON.stringify(results));
            sessionStorage.setItem('unfairId', documentId);
            } catch (error) {
            console.error('불공정약관탐지실패', error);
            navigate('/error', {
                state: {
                source: '불공정약관 탐지',
                code: error.code || 'UNKNOWN',
                message: error.message || '알 수 없는 에러가 발생했습니다.',
                },
            });
            }
        };

        loadSummary();
        loadUnfair();
    }, [htmlSource]);

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
        // console.log('✔ wantedPhrases (from storage):', result.wantedPhrases);
        // console.log('✔ summaryItems.map(c):', summaryItems.map(s => s.category));
        if (result.wantedPhrases) {
        setWantedPhrases(result.wantedPhrases);
        }
    });
    }, []);
    useEffect(() => {
        const cachedSummary = sessionStorage.getItem('summaryItems');
        const cachedUnfair = sessionStorage.getItem('unfairItems');
        const cachedSummaryId = sessionStorage.getItem('summaryId');
        const cachedUnfairId = sessionStorage.getItem('unfairId');

        if (cachedSummary && cachedUnfair) {
            console.log("📥 캐시에서 데이터 복원");
            setSummaryItems(JSON.parse(cachedSummary));
            setUnfairItems(JSON.parse(cachedUnfair));
            setSummaryId(cachedSummaryId);
            setUnfairId(cachedUnfairId);
        }
    }, []);

    // 매핑표표
    const categoryNameMap = {
    processingPurpose: "개인정보 처리 목적",
    collectedItems: "처리하는 개인정보의 항목",
    childrenUnder14: "14세 미민 아동의 개인정보 처리에 관한 사항",
    retentionPeriod: "개인정보의 처리 및 보유 기간",
    destructionProcedure: "개인정보의 파기 절차 및 방법에 관한 사항",
    thirdPartySharing: "개인정보의 제3자 제공에 관한 사항",
    additionalUseCriteria: "추가적인 이용, 제공이 지속적으로 발생 시 판단 기준",
    outsourcingInfo: "개인정보 처리업무 위탁에 관한 사항",
    overseasTransfer: "개인정보의 국외수집 및 이전에 관한 사항",
    securityMeasures: "개인정보의 안전성 확보 조치에 관한 사항",
    sensitiveInfoDisclosure: "민감정보의 공개 가능성 및 비공개를 선택하는 방법",
    pseudonymizedInfo: "가명정보 처리에 관한 사항",
    autoCollectionDevices: "개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항",
    behavioralTrackingByThirdParties: "개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집,이용 및 거부에 관한 사항",
    dataSubjectRights: "정보주체와 법정대리인의 권리, 의무 및 행사 방법에 관한 사항",
    privacyOfficerInfo: "개인정보 보호책임자의 성명 또는 개인정보 업무 담당 부서 및 고충사항을 처리하는 부서에 관한 사항",
    domesticAgent: "국내대리인 지정에 관한 사항",
    remedyForInfringement: "정보주체의 권익침해에 대한 구제방법",
    fixedCCTVOperation: "고정형 영상정보처리기기 운영, 관리에 관한 사항",
    mobileCCTVOperation: "이동형 영상정보처리기기 운영, 관리에 관한 사항",
    optionalPrivacyClauses: "개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항",
    policyChanges: "개인정보처리방침의 변경에 관한 사항"
    };

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
            {/* <button
            onClick={() => navigate('resultdetail', {
                state: { unfairId, unfairItems }
            })}
            className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#f7c8cc] transition"
            >
            더보기
            </button> */}
            <button
            onClick={() => {
                sessionStorage.setItem('unfairItems', JSON.stringify(unfairItems));
                sessionStorage.setItem('unfairId', unfairId);
                navigate('resultdetail', {
                state: { unfairId, unfairItems }
                });
            }}
            className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#f7c8cc] transition"
            >
            더보기
            </button>
        </div>

        {/* 불공정약관 내용 */}
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-5">
        {(() => {
            const filtered = unfairItems.filter(
            item => Array.isArray(item.detectedItems) && item.detectedItems.some(d => d.isUnfair)
            );
            const categories = [...new Set(filtered.map(item => item.category))];

            console.log("🟥 전체 unfairItems:", unfairItems);
            console.log("🟥 isUnfair === true 항목:", filtered);
            console.log("🟥 category 목록:", categories);

            if (filtered.length > 0) {
            return (
                <p>
                <strong>{categories.map(key => categoryNameMap[key] || key).join(', ')}</strong>
                {" 에서 불공정약관을 찾았습니다!"}
                </p>
            );
            } else {
            return null;
            }
        })()}
        </div>

        {/* 요약 제목 */}
        <div className="flex justify-between items-center mb-2">
            <span className="w-[100px] h-[35px] bg-[#FFFBCA] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center">
            요약
            </span>
            {/* <button
                onClick={() => navigate('resultsummarydetail', {
                    state: { summaryId, summaryItems }
                })}
                className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#bdd8fc] transition"
            >
                더보기
            </button> */}
            <button
            onClick={() => {
                sessionStorage.setItem('summaryItems', JSON.stringify(summaryItems));
                sessionStorage.setItem('summaryId', summaryId);
                navigate('resultsummarydetail', {
                state: { summaryId, summaryItems }
                });
            }}
            className="w-[100px] h-[35px] bg-[#F9D5D9] rounded-full text-[14px] font-bold font-['Noto_Sans'] flex items-center justify-center hover:bg-[#f7c8cc] transition"
            >
            더보기
            </button>
        </div>

        {/* 요약 내용 */}
        <div className="bg-white w-full text-sm px-4 py-3 whitespace-pre-wrap text-left rounded-lg border mb-4">
        {summaryItems.map((item, idx) => {
            const categoryName = categoryNameMap[item.category];
            
            // ✅ 조건: 사전 정의 항목 + 사용자 설정 항목(wantedPhrases)
            if (
            categoryName !== "개인정보 보호책임자의 성명 또는 개인정보 업무 담당 부서 및 고충사항을 처리하는 부서에 관한 사항" &&
            categoryName !== "개인정보 처리업무 위탁에 관한 사항" &&
            !wantedPhrases.includes(categoryName)
            ) return null;

            return (
            <div key={idx} className="mb-5">
                {item.summaryItems.map((summary, sIdx) => (
                <div key={sIdx} className="mb-3">
                    <strong>{categoryName}</strong><br />
                    {categoryName === "처리하는 개인정보의 항목"
                    ? highlightMatchedTerms(summary.summarize_content, userPrivacyItems)
                    : summary.summarize_content}
                </div>
                ))}
            </div>
            );
        })}
        </div>
        </div>
         </>
                )}
        </div>
    );
}