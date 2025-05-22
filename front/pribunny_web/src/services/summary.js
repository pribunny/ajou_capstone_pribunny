
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
            category: 'collection-purpose',
            summary_content: '회사는 서비스 제공을 위해 최소한의 개인정보를 수집하며, 수집된 정보는 맞춤형 서비스 제공 목적으로 활용됩니다.',
            },
            {
            category: 'third-party',
            summary_content: '회사는 고객 동의를 받아 개인정보를 제3자에게 제공하며, 제공받는 자, 제공 항목, 이용 목적 등을 명확히 고지합니다.',
            }
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