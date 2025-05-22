import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '../assets/home-button.png';
import { useLocation } from 'react-router-dom';

import {notifyServer} from '../services/uploadFile.js'
import Loading from '../components/Loading';
import ShowError from '../components/ShowError';

// 여기 새로고침하면 서버로 계속 데이턱 ㅏ전송되는 오류는?
export default function ResultPage() {

    const parseSessionItem = (key) => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : [];
        } catch {
            return [];
        }
    };

    const navigate = useNavigate();
    const location = useLocation();

    const fileNames = location.state?.fileNames || parseSessionItem('fileNames');
    const fileTypes = location.state?.fileTypes || parseSessionItem('fileTypes');
    const keys = location.state?.keys || parseSessionItem('keys');

    console.log("데이터를 받아옴[keys] : ", keys);
    console.log("데이터를 받아옴[fileTypes] : ", fileTypes);

    const [summaryItems, setSummaryItems] = useState([]);
    const [unfairItems, setUnfairItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]); //테스트용으로 일부러 넣음여

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

    // 초기값 유효성 검사
    useEffect(() => {
        if (!fileNames?.length || !fileTypes?.length || !keys?.length) {
            alert("업로드 정보가 유실되었습니다.");
            navigate('/');
            return;
        }
    }, []);

    useEffect(() => {
        const cachedSummary = sessionStorage.getItem('summaryItems');
        const cachedUnfair = sessionStorage.getItem('unfairItems');

        if (cachedSummary && cachedUnfair) {
            console.log("📥 캐시에서 데이터 복원");
            setSummaryItems(JSON.parse(cachedSummary));
            setUnfairItems(JSON.parse(cachedUnfair));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const cachedSummary = sessionStorage.getItem('summaryItems');
            const cachedUnfair = sessionStorage.getItem('unfairItems');
            if (cachedSummary && cachedUnfair) {
                console.log('🟢 sessionStorage에 요약/불공정 데이터 존재 → 서버 요청 생략');
                return;
            }

            try {
                const results = await notifyServer(keys, fileTypes);

                const summary_data = results
                    .filter(item => item.summaryItems)
                    .flatMap(item =>
                        item.summaryItems.map(summary => ({
                            category: summary.category_name,
                            summary_content: summary.summarize_content,
                        }))
                    );

                const unfair_data = results
                    .filter(item => Array.isArray(item.detectedItems))
                    .flatMap(item =>
                        item.detectedItems
                            .filter(detect => detect.isUnfair === true)
                            .map(detect => ({
                                category: item.category,
                                problemStatement: detect.problemStatement,
                                reason: detect.reason,
                                legalBasis: detect.legalBasis,
                            }))
                    );

                console.log("📤 서버에서 받아온 데이터:", { summary_data, unfair_data });

                // ✅ 캐시에 저장
                sessionStorage.setItem('summaryItems', JSON.stringify(summary_data));
                sessionStorage.setItem('unfairItems', JSON.stringify(unfair_data));
                sessionStorage.setItem('fileNames', JSON.stringify(fileNames));
                sessionStorage.setItem('fileTypes', JSON.stringify(fileTypes));
                sessionStorage.setItem('keys', JSON.stringify(keys));

                setSummaryItems(summary_data);
                setUnfairItems(unfair_data);
            } catch (err) {
                console.error("❌ Notify 요청 실패 :", err.message);
                setErrorMessage(err.message);
            }
        };
        fetchData();
    }, [fileNames, fileTypes, keys]);

    const getCategoryName = (key) => categoryNameMap[key] || key; //영어 조항 한글로 변환

    const goHome = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="bg-yellow-01 min-h-screen flex flex-col items-center text-black px-4">
            {errorMessage.length !== 0 ? (
                <ShowError message={errorMessage} />
            ) : (summaryItems.length === 0 ? (
                <Loading />
            ) : (
                <div className="w-full max-w-5xl py-10">
                    {/* 헤더 - pribunny, 홈 버튼 */}
                    <div className="w-full relative flex justify-center items-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold">PRIBUNNY</h2>
                        <button onClick={goHome} className="absolute right-4 md:right-0">
                            <img src={HomeIcon} alt="home_icon" className="w-6 h-6 md:w-8 md:h-8" />
                        </button>
                    </div>

                    {/* 결과 출력 부분 */}
                    <div className="bg-yellow-02 rounded-2xl md:p-6 space-y-6">
                        {/* 독소조항 탐지 출력 */}
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 text-left">불공정 조항 탐지 결과</h3>
                            <div className="bg-white rounded-2xl p-4">
                                {unfairItems.length > 0 ? (
                                    unfairItems.map((item, idx) => (
                                        <div key={idx} className="mb-3 text-left">
                                            <strong>{getCategoryName(item.category)}</strong><br />
                                            <p className="mt-1">{item.problemStatement}</p>
                                            <p className="text-sm text-gray-600 mt-1">{item.reason}</p>
                                            <p className="text-xs text-gray-500 mt-1 italic">{item.legalBasis}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div>탐지된 항목이 없습니다.</div>
                                )}
                            </div>
                        </div>

                        {/* 요약 출력 */}
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2 text-left">요약 결과</h3>
                            <div className="bg-white rounded-2xl p-4">
                                {summaryItems.map((item, idx) => (
                                    <div key={idx} className="mb-3 text-left">
                                        <strong>{getCategoryName(item.category)}</strong><br />
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

