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
            category: 'collection-purpose',
            summary_content: '회사는 서비스 제공을 위해 최소한의 개인정보를 수집하며, 수집된 정보는 맞춤형 서비스 제공 목적으로 활용됩니다.'
          },
          {
            category: 'third-party',
            summary_content: '회사는 고객 동의를 받아 개인정보를 제3자에게 제공하며, 제공받는 자, 제공 항목, 이용 목적 등을 명확히 고지합니다.'
          }
        ]
      }
    };


    const dummyDetect = {
      success: true,
      code: 'SUCCESS',
      message: '모든 탐지 결과를 성공적으로 반환했습니다.',
      responseTime: '2025-05-12T13:35:00.000000',
      data: {
        documentId: 'abc123',
        detect: [
          {
            category: 'pressure',
            detect_content: '이 항목은 사용자가 서비스를 해지하기 어렵게 구성되어 있어 선택을 압박할 수 있습니다.'
          },
          {
            category: 'obstruction',
            detect_content: '이 항목은 사용자가 정보를 쉽게 찾지 못하도록 숨겨져 있어 접근을 방해합니다.'
          }
        ]
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
                summary : summary_req.status === 'fulfilled' ? summary_res.value : null,
                detect : detect_req.status === 'fulfilled' ? detect_req.value : null,
            };
            const error = {
                summary : summary_req.status === 'rejected' ? summary_req.reason.toString() : null,
                detect : detect_req.status === 'rejected' ? detect_req.reason.toString() : null,
            };
            const success = summary_req.status === 'fulfilled' && detect_req.status === 'fulfilled';

            console.log('[Background] 서버 응답 결과 : ', {success, result, error});
            sendResponse({success, result, error});
        });
    return true; // 비동기 응답 유지
  }
});

// 오류코드 처리방식 -> 어떤 걸 우선적으로 확인 할 것인가?
// 아니면 일단 contnet.js로 데이터를 보내고 거기서 오류코드를 처리?