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

    const drag_summary_data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summaryText : drag_text, //이거 배열로 변경하기
        checkText : drag_text
      }),
    };

    const drag_detect_data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        detectText : drag_text, //이거 배열로 변경하기
        checkText : drag_text
      }),
    };

    const summary_req = fetch('https://pribuddy.shop/api/summary?data_size=short', drag_summary_data) //서버 주소 변경 필요
        .then(res => res.json());
    const detect_req = fetch('https://pribuddy.shop/api/unfairDetect?data_size=short', drag_detect_data) //서버 주소 변경 필요
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