
// 현재 프로젝트에선 서버로 데이터를 업데이트하거나 수정하는 등의 기능은 없음
// 따라서, GET 요청만 작성하면 됨
// 하지만, GET 요청의 경우 Data를 보낼 수 없음
// (params를 보낼  수 있지만, 데이터의 크기 제한)
// 그래서, POST 요청을 사용함.
// src/services/summary.js

// 요약 API의 주소를 보면 /api/summary? 형식이다. ?의 경우 query params를 나타내는 것임
import apiClient from './apiClient';
const USE_MOCK = true;

export const getSummarize = async(input_data, split) => {
    if (USE_MOCK) {
        return {
        summaryId: 'abc123',
        summaryItems: [
            {
            category: '개인정보의 처리 목적',
            summary_content: '회사는 회원관리, 민원처리, 서비스 제공, 마케팅, 부정이용 방지를 위해 개인정보를 처리합니다.',
            },
            {
            category: '처리하는 개인정보의 항목',
            summary_content: '회사는 회원가입 시 이메일, 비밀번호, 이름, 국가명, 의료기관 정보 등을 수집하며, 결제 시 신용카드 및 계좌정보, 이름, 전화번호, 이메일, CI/DI, 빌링 키(정기결제 시) 등을 수집합니다. 서비스 이용 시 IP주소, 쿠키, 브라우저 정보, 이용기록, 방문기록, 디바이스 및 OS 정보, 앱 설치일 등을 수집합니다.',
            },
            {
            category: '개인정보의 제3자 제공에 관한 사항',
            summary_content: '회사는 제3자 제공합니다.',
            },
            {
            category: '개인정보의 처리업무의 위탁에 관한 사항',
            summary_content: '회사는 업무 위탁합니다.',
            },
            {
            category: '개인정보 국외 수집 및 이전에 관한 사항',
            summary_content: '개인정보는 Amplitude, Inc, MOLOCO, Inc., Braze,Inc.등 해외 업체로 이전되며, 회원 탈퇴 시까지 보유합니다.'
            },

        ]
        };
    }
    try{
        const response = await apiClient.post('/api/summary',
        {input_data},
        {params : { data_size: split }}
    );
        if(response?.status === 200) return response.data.data;
    }catch(err){
        if(err.response?.status === 400){
            const error = new Error('에러에 관한 설명');
            error.code = 'Bad Request';
            throw error;
        }
        if(err.response?.status === 401){}
        if(err.response?.status === 408){}
    }
};