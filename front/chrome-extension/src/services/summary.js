// src/services/summary.js

import apiClient from './apiClient';

// const USE_MOCK = true;
const USE_MOCK = false;


export const getSummarize = async (input_data, split) => {
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
          summary_content:
            '회사는 회원가입 시 이메일, 비밀번호, 이름, 국가명, 의료기관 정보 등을 수집하며, 결제 시 신용카드 및 계좌정보, 이름, 전화번호, 이메일, CI/DI, 빌링 키(정기결제 시) 등을 수집합니다. 서비스 이용 시 IP주소, 쿠키, 브라우저 정보, 이용기록, 방문기록, 디바이스 및 OS 정보, 앱 설치일 등을 수집합니다.',
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
          summary_content: '개인정보는 Amplitude, Inc, MOLOCO, Inc., Braze,Inc.등 해외 업체로 이전되며, 회원 탈퇴 시까지 보유합니다.',
        },
      ],
    };
    // return{
    //     "success": true,
    //     "code": "SUCCESS",
    //     "message": "모든 요약 결과를 성공적으로 통합했습니다.",
    //     "responseTime": "2025-05-12T13:35:00.000000",
    //     "data": {
    //           "documentId": "adb123",
    //           "results": [
    //               {
    //                   "category": "collectedItems",
    //                   "summaryItems": [
    //                       {
    //                           "category_name": "처리하는 개인정보의 항목",
    //                           "summarize_content": "회사는 고객의 이름과 생년월일을 수집합니다."
    //                       }
    //                   ]
    //               },
    //               {
    //                   "category": "thirdPartySharing",
    //                   "summaryItems": [
    //                       {
    //                           "category_name": "기타",
    //                           "summarize_content": "소제목: 제3자 정보 제공\n회사는 광고 목적으로 정보를 제3자에게 제공할 수 있습니다."
    //                       }
    //                   ]
    //               },
    //               {
    //                   "category": "privacyOfficerInfo",
    //                   "summaryItems": [
    //                       {
    //                           "category_name": "개인정보 보호 책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항",
    //                           "summarize_content": "개인정보 보호책임자는 고객 문의를 처리합니다."
    //                       }
    //                   ]
    //               }
    //           ]
    //         }
    //   }
  }

  try {
    const response = await apiClient.post(
      '/api/summary',
      {
        summaryText : input_data,
        checkText : 'text/plain'
      },
      { params: { data_size: split } }
    );
    console.log("들어옴");
    if (response?.status === 200){
      console.log("test : ", response.data);
      return response.data.data;
    } 
  } catch (err) {
    const status = err.response?.status;
    const error = new Error();

    if (!err.response) {
      error.message = '요약 처리 실패 (네트워크 오류)';
      error.code = 'NETWORK_ERR';
    } else {
      switch (status) {
        case 400:
          error.message = '요약할 텍스트가 필요합니다.';
          error.code = 'NO_TEXT';
          break;
        case 422:
          error.message = '요청 형식이 올바르지 않습니다.';
          error.code = 'FORMAT_ERR';
          break;
        case 500:
          error.message = '요약 처리 실패 (서버 내부 오류)';
          error.code = 'SERVER_ERR';
          break;
        case 408:
          error.message = '요청이 타임아웃되었습니다.';
          error.code = 'TIMEOUT';
          break;
        case 404:
        case 405:
          error.message = '잘못된 HTTP 요청입니다.';
          error.code = 'HTTP_ERR';
          break;
        default:
          error.message = `요약 처리 실패 (알 수 없는 오류: ${status})`;
          error.code = 'UNKNOWN';
      }
    }

    throw error;
  }
};