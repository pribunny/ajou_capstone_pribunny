// 현재 프로젝트에선 서버로 데이터를 업데이트하거나 수정하는 등의 기능은 없음
// 따라서, GET 요청만 작성하면 됨
// 하지만, GET 요청의 경우 Data를 보낼 수 없음 
// (params를 보낼  수 있지만, 데이터의 크기 제한)
// 그래서, POST 요청을 사용함.
// src/services/summary.js

// 요약 API의 주소를 보면 /api/summary? 형식이다. ?의 경우 query params를 나타내는 것임
import apiClient from './apiClient';
const USE_MOCK = true;

//export const getUnfairDetect = async(input_data, split) => {
//    if (USE_MOCK) {
//        return {
//        unfairId: 'def123',
//        unfairItems: [
//          {
//            category: 'pressure',
//            detect_content: '이 항목은 사용자가 서비스를 해지하기 어렵게 구성되어 있어 선택을 압박할 수 있습니다.'
//          },
//          {
//            category: 'obstruction',
//            detect_content: '이 항목은 사용자가 정보를 쉽게 찾지 못하도록 숨겨져 있어 접근을 방해합니다.'
//          }
//        ]
//        };
//    }
//    try{
//        const response = await apiClient.post('/api/unfair',
//        {input_data},
//        {params : { data_size: split }}
//    );
//        if(response?.status === 200) return response.data.data;
//    }catch(err){
//        if(err.response?.status === 400){
//            const error = new Error('에러에 관한 설명');
//            error.code = 'Bad Request';
//            throw error;
//        }
//        if(err.response?.status === 401){}
//        if(err.response?.status === 408){}
//    }
//};

export const getUnfairDetect = async (input_data, split) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          unfairId: 'def123',
          unfairItems: [
            {
              category: '개인정보 처리 목적',
              detect_content: 
              `
              1. 문제 표현: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 연령 확인, 각종 고지·통지·연락, 서비스 부정이용 방지, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
              2. 문제 이유: 표준 개인정보 보호지침 제18조(개인정보 처리방침의 작성기준 등)에 따르면, 개인정보처리방침은 개인정보의 처리 목적을 구체적이고 명확하게 작성해야 하며, '~등'과 같은 모호한 표현을 사용해서는 안 됩니다. 따라서 "회원 가입 및 서비스 개발 등"이라는 표현은 구체적인 목적을 명시하지 않고, '~등'이라는 모호한 표현을 사용하여 개인정보 처리 목적을 명확히 하지 않았습니다. 개인정보 처리 목적은 정보주체가 이해할 수 있도록 구체적이고 명확하게 작성되어야 하며, 각 목적에 따라 필요한 개인정보 항목과 처리 방식을 명확히 설명해야 합니다.
              3. 근거 기준:
                  - 관련 법령 조항: 표준 개인정보 보호지침 제18조(개인정보 처리방침의 작성기준 등)
              `
            }
            // {
            //   category: '개인정보 파기 방법 및 절차',
            //   detect_content: 
            //   `
            //   1. 문제 표현: "단, 내부 정책에 따라 파기가 지연될 수 있습니다."
            //   2. 문제 이유: 개인정보보호위원회 개인정보보호지침 제11조(개인정보의 파기 방법 및 절차)에 따르면, 개인정보처리자는 개인정보의 보유 기간이 경과하거나 처리 목적이 달성되었을 때, 정당한 사유가 없는 한 지체 없이 해당 개인정보를 파기해야 합니다. 특히, 제11조는 개인정보가 불필요하게 되었을 때 5일 이내에 파기할 것을 명시하고 있습니다. 따라서 내부 정책에 따라 파기가 지연될 수 있다는 문구는 법적 기준을 위반할 가능성이 있습니다. 개인정보 보호법 제11조에 따르면, 개인정보처리방침은 개인정보가 불필요하게 되었을 때 지체 없이 파기되어야 하며, 내부 정책에 따라 파기가 지연될 수 있다는 내용은 포함되어서는 안 됩니다.
            //   3. 근거 기준:
            //       - 관련 법령 조항: 개인정보보호위원회 개인정보보호지침 제11조(개인정보의 파기 방법 및 절차)
              
            //   `
            // }
          ]
        });
      }, 2000); // 2초 지연
    });
  }
  try{
      const response = await apiClient.post('/api/unfair',
      {
        detectText : input_data.html,
        checkText : input_data.text
      },
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

  // 이하 실제 API 호출 부분
};

// export const getUnfairDetect = async(input_data, split) => {
//     if (USE_MOCK) {
//         return {
//         unfairId: 'def123',
//         unfairItems: [
//           {
//             category: '개인정보 처리 목적',
//             detect_content: 
//             `
//             1. 문제 표현: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 연령 확인, 각종 고지·통지·연락, 서비스 부정이용 방지, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
//             2. 문제 이유: 표준 개인정보 보호지침 제18조(개인정보 처리방침의 작성기준 등)에 따르면, 개인정보처리방침은 개인정보의 처리 목적을 구체적이고 명확하게 작성해야 하며, '~등'과 같은 모호한 표현을 사용해서는 안 됩니다. 따라서 "회원 가입 및 서비스 개발 등"이라는 표현은 구체적인 목적을 명시하지 않고, '~등'이라는 모호한 표현을 사용하여 개인정보 처리 목적을 명확히 하지 않았습니다. 개인정보 처리 목적은 정보주체가 이해할 수 있도록 구체적이고 명확하게 작성되어야 하며, 각 목적에 따라 필요한 개인정보 항목과 처리 방식을 명확히 설명해야 합니다.
//             3. 근거 기준:
//                 - 관련 법령 조항: 표준 개인정보 보호지침 제18조(개인정보 처리방침의 작성기준 등)
//             `
//           }
//           // {
//           //   category: '개인정보 파기 방법 및 절차',
//           //   detect_content: 
//           //   `
//           //   1. 문제 표현: "단, 내부 정책에 따라 파기가 지연될 수 있습니다."
//           //   2. 문제 이유: 개인정보보호위원회 개인정보보호지침 제11조(개인정보의 파기 방법 및 절차)에 따르면, 개인정보처리자는 개인정보의 보유 기간이 경과하거나 처리 목적이 달성되었을 때, 정당한 사유가 없는 한 지체 없이 해당 개인정보를 파기해야 합니다. 특히, 제11조는 개인정보가 불필요하게 되었을 때 5일 이내에 파기할 것을 명시하고 있습니다. 따라서 내부 정책에 따라 파기가 지연될 수 있다는 문구는 법적 기준을 위반할 가능성이 있습니다. 개인정보 보호법 제11조에 따르면, 개인정보처리방침은 개인정보가 불필요하게 되었을 때 지체 없이 파기되어야 하며, 내부 정책에 따라 파기가 지연될 수 있다는 내용은 포함되어서는 안 됩니다.
//           //   3. 근거 기준:
//           //       - 관련 법령 조항: 개인정보보호위원회 개인정보보호지침 제11조(개인정보의 파기 방법 및 절차)
            
//           //   `
//           // }
//         ]
//         };
//     }
//     try{
//         const response = await apiClient.post('/api/unfair',
//         {input_data}, 
//         {params : { data_size: split }}
//     );
//         if(response?.status === 200) return response.data.data;
//     }catch(err){
//         if(err.response?.status === 400){
//             const error = new Error('에러에 관한 설명');
//             error.code = 'Bad Request';
//             throw error;
//         }
//         if(err.response?.status === 401){}
//         if(err.response?.status === 408){}
//     }
// };

