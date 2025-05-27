import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SetIcon from '../assets/setting-button.png';
import HomeIcon from '../assets/home-button.png';
import { getSummarize } from '../services/summary';
import { getUnfairDetect } from '../services/unfair';
import { getPresigned, uploadToS3 } from '../services/uploadFile';

import DOMPurify from 'dompurify'; // XSS 방지를 위함 -> npm install dompurify 해야됩니당
import Loading from '../components/Loading';

export default function ResultPage() {
    const navigate = useNavigate();
    const [summaryId, setSummaryId] = useState("");
    const [summaryItems, setSummaryItems] = useState([]);
    const [unfairId, setUnfairId] = useState("");
    const [unfairItems, setUnfairItems] = useState([]);
    const [userPrivacyItems, setUserPrivacyItems] = useState([]);
    const [wantedPhrases, setWantedPhrases] = useState([]);
    const hasUploadedRef = useRef(false);
    const [key, setKey] = useState("");

    useEffect(() => {
            function generateFilename(prefix = 'upload', ext = 'txt') {
                const now = new Date();
                const pad = (n) => n.toString().padStart(2, '0');
                const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
                const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
                const random = Math.random().toString(36).substring(2, 8);
                console.log("[generateFilename] 파일 생성중 " );
                return `${prefix}_${date}_${time}_${random}.${ext}`;
            }

            // HTML 데이터 처리 함수
            const getHtmlSource = async (htmlText) => {
                if(hasUploadedRef.current){
                    console.log("[getHtmlSource] : 중복 데이터 요청 막음");
                    return;
                } //중복으로 요청이 가는 것을 막기 위함
                hasUploadedRef.current = true;

                try {
                    // 1. 텍스트 파일 생성
                    const cleanHTML = DOMPurify.sanitize(htmlText); //여기 content.js 코드 수정하기
                    console.log("[getHtmlSource] 데이터 받아옴 : ", cleanHTML);
                    const blob = new Blob([cleanHTML], { type: 'text/plain' });
                    const filename = generateFilename('html', 'txt');
                    const file = new File([blob], filename, { type: 'text/plain' });
                    console.log("[getHtmlSource] 파일 생성 완료 :", file);
                    console.log(await file.text());

                    // 2. presigned URL 요청
                    const {key : key, uploadURL : uploadURL} = await getPresigned(file.name, file.type); // 배열로 보냄
                    console.log("[getPresignedUrl] 생성완료(key, presignedUrl) : ",key, uploadURL );

                    // 3. S3에 업로드

                    if(await uploadToS3(file, uploadURL)) setKey(key);
                    console.log("업로드 완료:", file.name);

                } catch (err) {
                    console.error("업로드 실패:", err);

                    navigate('/error', {
                        state: {
                        source: '업로드 실패',
                        code: err.code || 'UNKNOWN',
                        message: err.message || '알 수 없는 에러가 발생했습니다.',
                        },
                    });
                }
            };

            // 메시지 리스너 등록
            const handleMessage = (request) => {
                if (request.action === "take_full_data") {
                    console.log("[ResultPage] 받은 텍스트:", request.source);

                    const cachedSummary = sessionStorage.getItem('summaryItems');
                    const cachedUnfair = sessionStorage.getItem('unfairItems');

                    if (cachedSummary && cachedUnfair) {
                        console.log("🟢 캐시 존재 → 업로드 및 요청 생략");
                        return;
                    }

                    getHtmlSource(request.source); //캐시 없을 경우에만 진행
                }
            };

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "give_full_data" });
            });

            chrome.runtime.onMessage.addListener(handleMessage);
            return () => chrome.runtime.onMessage.removeListener(handleMessage);

        }, []);


    useEffect(() => {
        if (!key) {
            console.log('[서버 데이터 요청 부분] key 값이 존재하지 않음');
            return;
        }

        // 🛑 이미 summary/unfair 데이터가 sessionStorage에 있으면 다시 요청하지 않음
        const cachedSummary = sessionStorage.getItem('summaryItems');
        const cachedUnfair = sessionStorage.getItem('unfairItems');
        if (cachedSummary && cachedUnfair) {
            console.log('🟢 sessionStorage에 요약/불공정 데이터 존재 → 서버 요청 생략');
            return;
        }

        console.log("[서버 데이터 요청 부분] 서버 요청 시작");

        const loadSummary = async () => {
            try {
            const data = await getSummarize(key, 'long');
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
            const data = await getUnfairDetect(key, 'long');
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
    }, [key]);

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
                console.log("🟥 전체 unfairItems:", unfairItems);

                const detectCategory = unfairItems.flatMap(item => item.detectedItems).filter(it => it.isUnfair).map(it => it.category);
                console.log("🟥 isUnfair === true 항목, category 이름 :", detectCategory);

                if (detectCategory.length > 0) {
                    return (
                        <p>
                        <strong>{detectCategory.map(key => categoryNameMap[key] || key).join(', ')}</strong>
                        {" 에서 불공정약관을 찾았습니다!"}
                        </p>
                    );
                } else {
                    //return null;
                    return <p>탐지된 불공정 조항이 없습니다!</p>;
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

            console.log("🟥 전체 summaryItems:", summaryItems);

            const filteredSummaries = item.summaryItems.filter(summary =>{
                const categoryName = categoryNameMap[summary.category_name];
                console.log("🟥 categoryName:", categoryName);
                return(
                    categoryName !== "개인정보 처리 목적" &&
                    categoryName !== "처리하는 개인정보의 항목" &&
                    !wantedPhrases.includes(categoryName)
                );
            });

            if(filteredSummaries.length === 0) return null;

            return (
                <div key={idx} className="mb-5">
                    {filteredSummaries.map((summary, sIdx) => {
                        const categoryName = categoryNameMap[summary.category_name];
                        return(
                            <div key={sIdx} className="mb-3">
                                <strong>{categoryName}</strong><br />
                                {categoryName === "처리하는 개인정보의 항목"
                                ? highlightMatchedTerms(summary.summarize_content, userPrivacyItems)
                                : summary.summarize_content}
                            </div>
                        );
                    })}
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