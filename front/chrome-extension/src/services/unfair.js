// 현재 프로젝트에선 서버로 데이터를 업데이트하거나 수정하는 등의 기능은 없음
// 따라서, GET 요청만 작성하면 됨
// 하지만, GET 요청의 경우 Data를 보낼 수 없음 
// (params를 보낼  수 있지만, 데이터의 크기 제한)
// 그래서, POST 요청을 사용함.
// src/services/summary.js

// 요약 API의 주소를 보면 /api/summary? 형식이다. ?의 경우 query params를 나타내는 것임
import apiClient from './apiClient';
const USE_MOCK = true;

export const getUnfairDetect = async(input_data, split) => {
    if (USE_MOCK) {
        return {
        unfairId: 'def123',
        unfairItems: [
          {
            category: 'pressure',
            detect_content: '이 항목은 사용자가 서비스를 해지하기 어렵게 구성되어 있어 선택을 압박할 수 있습니다.'
          },
          {
            category: 'obstruction',
            detect_content: '이 항목은 사용자가 정보를 쉽게 찾지 못하도록 숨겨져 있어 접근을 방해합니다.'
          }
        ]
        };
    }
    try{
        const response = await apiClient.post('/api/unfair',
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