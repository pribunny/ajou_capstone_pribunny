import React from 'react';
import {useNavigate} from 'react-router-dom';

export default function ResultPage() {
    const navigate = useNavigate();
    return (
        <div>
            <h2>분석 결과 페이지입니다!</h2>
        <div>불공정약관 탐지 결과
            <span onClick={() => navigate('/details')}>상세 결과 보러가기</span>
        </div>
        <div>조항 요약 결과
            <div>
                <span>1. 개인정보 수집 목적</span>
                <span>2. 수집하는 개인 정보 목록</span>
                <span onClick={() => navigate('/details')}>3. 제3자 제공 </span>
            </div>
        </div>
    </div>
  );
}
