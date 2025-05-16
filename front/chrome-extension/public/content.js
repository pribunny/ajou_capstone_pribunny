/** TODO
 1. button 생성 코드 분리하기(가독성 및 유지보수성 향상)
 2. 로딩화면 구현 고민 -> result 요소 내부에 loading 요소 삽입 & 데이터 오면 삭제되는 형식으로
 3. 결과 화면 만들기
 4. 결과 화면 생성 위치 조정 -> const rects = range.getClientRects(); 이용
 5. 결과 화면 닫기 구현
 **/



// Listner로 'get_full_data' 요청 기다리기
// 요청이 들어오면, 전체 html중 <body> 태그 안 데이터 긁어서 Listner로 전달
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[GET Full Data] 실행");
    if (request.action === "give_full_data") {
        console.log("📨 요청 받음 → 텍스트 전송");
        chrome.runtime.sendMessage({
            action: "take_full_data",
            source: document.body.outerHTML //body HTML 데이터 가져오기
        });
        }
    });

// 드래그 부분
function removeExistingButton() {
  const old = document.getElementById('analyze-button');
  if (old) old.remove();
}

document.addEventListener('mouseup', (e) => {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length >= 200 && selectedText.length <= 1000) {
        console.log("[MouseUP] 텍스트:", selectedText);

        setTimeout(() => {
            //timeout을 걸고 버튼을 생성 -> 버튼을 눌렀을 때 바로 사라지지 않도록(mouseup 흐름을 뒤로 미룬다)
            const existing = document.getElementById('analyze-button');
            if (existing) existing.remove();

            const button = document.createElement('img');
            button.id = 'analyze-button';
            button.src = chrome.runtime.getURL('extension_logo.png');  // ← 확장 프로그램 내 이미지 경로
            button.alt = '분석하기';
            button.style.position = 'absolute';
            button.style.top = `${e.clientY}px`;
            button.style.left = `${e.clientX}px`; // 마우스 이시키 디질라고 너 다시 보자.
            button.style.zIndex = '999999';
            button.style.width = '25px';   // 적절한 크기 조절
            button.style.height = '25px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '6px';
            button.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
            button.style.background = '#fff';
            button.style.padding = '4px';

            document.body.appendChild(button);

            button.addEventListener('click', () => {
            console.log('[✅ 버튼 클릭됨]');

            chrome.runtime.sendMessage({ //버튼을 클릭하면 바로 요소 생성 들어가고 거기에서 요청을 보내는 방식으로 수정 필
                action: 'analyze_dragData',
                payload: selectedText
                }, (response) => {
                    if(response.success){
                        const {summary, detect} = response.result;

                        const btn = document.getElementById('analyze-button');
                        if (btn) btn.remove();

                        showResult(summary, detect);
                    } else{
                        console.error('[content]서버 요청 실패 : ', response.error);
                    }
                });
            });

            // 버튼 외부 클릭 시 버튼 제거
            function outsideClickHandler(e){
                if(!button.contains(e.target)){
                    button.remove();
                    document.removeEventListener('mousedown', outsideClickHandler);
                }
            }
            setTimeout(() => {
                document.addEventListener('mousedown', outsideClickHandler);
            },0);
        }, 0);
    }
});

// 결과 화면 생성 코드
function showResult(summary, detect){
    const oldResult = document.getElementById('result-element');
    if(oldResult) oldResult.remove();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length < 1) return;

    // 마지막 줄 2개 기준
    const widthRect = rects[rects.length - 2] || rects[0];
    const lastRect = rects[rects.length - 1];

    // 가운데 x 좌표 계산
    const centerX = widthRect.left + (widthRect.width / 2);
    // 아래쪽 y 좌표 계산
    const bottomY = lastRect.bottom + window.scrollY + 10;  // 10px 아래 띄우기


    //결과 요소 생성하기
    const result = document.createElement('div');
    result.id = 'result-element';
    result.style.position = 'absolute';
    result.style.top = `${bottomY}px`;
    result.style.left = `${centerX}px`;
    result.style.transform = 'translateX(-50%)';
    result.style.background = '#fff';
    result.style.border = '1px solid #aaa';
    result.style.padding = '16px';
    result.style.zIndex = '999999';
    result.style.maxWidth = '400px';
    result.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
    result.style.borderRadius = '8px';

    //결과 - 닫기 버튼 생성
    const close_button = document.createElement('span');
    close_button.textContent = '✖';
    close_button.style.position = 'absolute';
    close_button.style.top = '8px';
    close_button.style.right = '12px';
    close_button.style.cursor = 'pointer';
    close_button.style.fontSize = '14px';
    close_button.addEventListener('click', () => {
        result.remove();
        document.removeEventListener('mousedown', outsideClickHandler);
    });

    // 결과 데이터 출력 요소 생성 -> 드래그의 경우 데이터가 많지 않기 때문에 전체를 모두 출력하도록 함
    // 여기 백엔드 API 최종 코드 수정 후에 데이터 형식 수정 필요

    const detect_all_elements = document.createElement('div');
    const detect_title = document.createElement('h4');
    detect_title.textContent = '불공정 조항 탐지 결과';
    detect_all_elements.appendChild(detect_title);

    if (detect.data.detect && detect.data.detect.length === 0) {
      //탐지된 결과가 없는 경우에 대한 처리
        const detect_element = document.createElement('div');
        const detect_category = document.createElement('span');
        detect_category.textContent = '탐지된 결과가 없습니다.';


        //생성한 요소를 추가한다.
        detect_element.appendChild(detect_category);
        detect_all_elements.appendChild(detect_element);
    }

    else{
        detect.data.detect.forEach(item => { //각각의 데이터를 하나씩 출력한다.
        const detect_element = document.createElement('div');
        const detect_category = document.createElement('span');
        detect_category.textContent = `[${item.category}]`;

        const detect_content = document.createElement('p');
        detect_content.textContent = `[${item.detect_content}]`;

        //생성한 요소를 추가한다.
        detect_element.appendChild(detect_category);
        detect_element.appendChild(detect_content);
        detect_all_elements.appendChild(detect_element);
        });
    }


    //요약 결과 출력 코드
    const summary_all_elements = document.createElement('div');
    const summary_title = document.createElement('h4');
    summary_title.textContent = '조항별 요약 결과';
    summary_title.className = 'text-sm font-semibold';
    summary_all_elements.appendChild(summary_title);

    summary.data.summary.forEach(item => { //각각의 데이터를 하나씩 출력한다.
        const summary_element = document.createElement('div');
        const summary_category = document.createElement('span');
        summary_category.textContent = `[${item.category}]`;

        const summary_content = document.createElement('p');
        summary_content.textContent = `[${item.summary_content}]`;

        //생성한 요소를 추가한다.
        summary_element.appendChild(summary_category);
        summary_element.appendChild(summary_content);
        summary_all_elements.appendChild(summary_element);
    });

    //화면에 생성한 요소들을 삽입
    result.appendChild(close_button);
    result.appendChild(detect_all_elements);
    result.appendChild(summary_all_elements);
    document.body.append(result);

    //

    // 결과 화면 제거
    function outsideClickHandler(e){
        if(!result.contains(e.target)){
            result.remove();
            document.removeEventListener('mousedown', outsideClickHandler);
        }
    }
    setTimeout(() => {
        document.addEventListener('mousedown', outsideClickHandler);
    },0);
}