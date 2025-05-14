console.log('[background.js] loaded');

// 서버로 데이터 요청 -> 하나씩 진행하는 게 아닌, 2개를 동시에 진행할 수 있도록 수정
// 서버에서 데이터 받기
// 오류 코드 확인 및 통합
// 데이터 통합
// 반환

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  if (action === 'analyze_dragData') {
    const drag_text = payload;

    console.log('[Background] 서버 요청 데이터 :', drag_text);

    const testMode = true; // ✅ 테스트 모드 on

    if (testMode) { //테스트 코드임
    const dummySummary = {
      success: true,
      code: 'SUCCESS',
      message: '모든 요약 결과를 성공적으로 통합했습니다.',
      responseTime: '2025-05-12T13:35:00.000000',
      data: {
        documentId: 'abc123',
        summary: [
          {
            category: "개인정보의 처리 및 보유 기간",
            summary_content: "동의 철회 또는 탈퇴 요청 후 5일 이내 지체 없이 개인정보를 파기합니다."
          },
          {
            category: "기타",
            summary_content: "무신사 스토어, 29CM 등의 다양한 서비스 정보를 제공하며, 원하지 않을 경우 언제든지 알림 설정을 통해 철회할 수 있습니다. 선택적 개인정보 수집 및 이용은 거부할 수 있으며, 동의하지 않아도 서비스 이용은 가능하지만 혜택 정보 제공은 제한될 수 있습니다."
          }
        ]
      }
    };



       const dummyDetect = {
         success: true,
         code: 'SUCCESS',
         message: '탐지된 결과가 없습니다.',
         responseTime: '2025-05-12T13:35:00.000000',
         data: {
           documentId: 'abc123',
           detect: []
         }
       };


    const result = {
      detect: dummyDetect,
      summary: dummySummary,
    };

    const error = {
      summary: null,
      detect: null,
    };

    console.log('[Background] 테스트 응답 전송:', { success: true, result, error });
    sendResponse({ success: true, result, error });
    return true;
    } //여기까지 테스트 코드임

    const drag_req_data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({drag_text}),
    };

    const summary_req = fetch('./api/summary?datasize=short', drag_req_data) //서버 주소 변경 필요
        .then(res => res.json());
    const detect_req = fetch('./api/unfairDetect?datasize=short', drag_req_data) //서버 주소 변경 필요
        .then(res => res.json());

    Promise.allSettled([summary_req, detect_req])
        .then(([summary_res, detect_res]) => {
            const result = {
                summary : summary_res.status === 'fulfilled' ? summary_res.value : null,
                detect : detect_res.status === 'fulfilled' ? detect_res.value : null,
            };
            const error = {
                summary : summary_res.status === 'rejected' ? summary_res.reason.toString() : null,
                detect : detect_res.status === 'rejected' ? detect_res.reason.toString() : null,
            };
            const success = summary_res.status === 'fulfilled' && detect_res.status === 'fulfilled';

            console.log('[Background] 서버 응답 결과 : ', {success, result, error});
            sendResponse({success, result, error});
        });
    return true; // 비동기 응답 유지
  }
});

// 오류코드 처리방식 -> 어떤 걸 우선적으로 확인 할 것인가?
// 아니면 일단 contnet.js로 데이터를 보내고 거기서 오류코드를 처리?