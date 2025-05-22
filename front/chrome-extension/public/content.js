/** TODO
 1. button 생성 코드 분리하기(가독성 및 유지보수성 향상)
 2. 로딩화면 구현 수정
    2.1 버튼도 같이 삭제되도록 -> 현재 button에서 서버와 통신하는 부분이 남아있기 때문에 loading에서 없애는 건 안된다. -> 서버와 통신하는 부분 위치를 바꾸는 건?
    2.2 로딩중 디자인 수정
 3. 에러 화면 구성
    3.1 서버에러 -> 그냥 다시 시도해주세요
    3.2 데이터 에러 -> 개인정보처리방침 및 수집이용동의서 내용이 아닙니다.
 4. 디자인 수정(Result 디자인 수정 -> 길이 유동적으로 조절 / 항목 결과 예쁘게 뽑기)
 **/



// Listner로 'get_full_data' 요청 기다리기
// 요청이 들어오면, 전체 html중 <body> 태그 안 데이터 긁어서 Listner로 전달
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[GET Full Data] 실행");
    if (request.action === "give_full_data") {
        console.log("📨 요청 받음 → 텍스트 전송");
        chrome.runtime.sendMessage({
            action: "take_full_data",
            source : {
                html: document.body.outerHTML, //body HTML 데이터 가져오기
                text: document.body.innerText //body 텍스트 데이터 가져오기
            }
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
        if (document.getElementById('analyze-button')) return; //해당 요소가 있으면 제거함.
        console.log("[MouseUP] 텍스트:", selectedText);

        setTimeout(() => {
            //timeout을 걸고 버튼을 생성 -> 버튼을 눌렀을 때 바로 사라지지 않도록(mouseup 흐름을 뒤로 미룬다)
            try{
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
                    showLoading();
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

            }catch(err){
                console.error("setTimeout 내부 에러...", err);
            }
        }, 0);
    }
});


// 로딩 페이지 코드 -> 결과화면 생성 후 Loading 요소 추가
function showLoading(){

    const analyzeBtn = document.getElementById('analyze-button');
    if (analyzeBtn) {
        console.log('[showLoading] 버튼 제거됨');
        analyzeBtn.remove();
    }
    const selectedText = window.getSelection().toString().trim();
    console.log('[showLoading 실행]');

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
    result.style.background = '#FFFDEB';
    result.style.border = '1px solid #aaa';
    result.style.padding = '16px';
    result.style.zIndex = '999999';
    result.style.maxWidth = '400px';
    result.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
    result.style.borderRadius = '8px';

    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = '데이터를 분석하고 있습니다...';
    result.appendChild(loadingMsg);

    // CSS 스피너 생성
    const dotsContainer = document.createElement('div');
    dotsContainer.style.display = 'flex';
    dotsContainer.style.justifyContent = 'center';
    dotsContainer.style.alignItems = 'center';
    dotsContainer.style.marginTop = '10px';
    dotsContainer.style.gap = '6px';
    dotsContainer.className = 'dot-spinner'; // (선택적으로 클래스 부여)

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = '#000000';
        dot.style.animation = `dot-bounce 1.4s infinite ease-in-out both`;
        dot.style.animationDelay = `${i * 0.2}s`;
        dotsContainer.appendChild(dot);
    }

    result.appendChild(dotsContainer);

    // 스피너 애니메이션을 위한 스타일 정의
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes dot-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
    }`;
    document.head.appendChild(style);
    document.body.append(result);

    setTimeout(() => {
        chrome.runtime.sendMessage({ //로딩중 화면에서 데이터를 전송하는 방식
            action: 'analyze_dragData',
            payload: selectedText
            }, (response) => {
                if(response.success){
                    const {summary, detect} = response.result;

                    showResult(summary, detect);
                } else{
                    console.error('[content]서버 요청 실패 : ', response.error);
                    showError(response.error);
                }
        });
    }, 0);
};

// 오류 페이지 코드
function showError(error_res) {
    console.log('[showError] called');

    let result = document.getElementById('result-element');
    if (!result) {
        console.log('[showError] result-element가 없어서 새로 생성합니다.');
        result = document.createElement('div');
        result.id = 'result-element';
        result.style.position = 'absolute';
        result.style.top = '200px';
        result.style.left = '50%';
        result.style.transform = 'translateX(-50%)';
        result.style.background = '#FFFDEB';
        result.style.border = '1px solid #aaa';
        result.style.padding = '16px';
        result.style.zIndex = '999999';
        result.style.maxWidth = '400px';
        result.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
        result.style.borderRadius = '8px';
        document.body.appendChild(result);
    }

    result.innerHTML = '';
    //result.style.height = '200px';

    const close_button = document.createElement('span');
    close_button.textContent = '✖';
    close_button.style.position = 'absolute';
    close_button.style.top = '8px';
    close_button.style.right = '12px';
    close_button.style.zIndex = '10';
    close_button.style.cursor = 'pointer';
    close_button.style.fontSize = '14px';
    close_button.addEventListener('click', () => {
        result.remove();
        document.removeEventListener('mousedown', outsideClickHandler);
    });

    const contentWrapper = document.createElement('div');
    contentWrapper.style.position = 'relative';
    contentWrapper.style.width = '100%';
    contentWrapper.style.height = 'auto';

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('error_icon.png');
    img.style.width = '70%';
    img.style.height = 'auto';
    img.style.objectFit = 'cover';
    img.style.opacity = '0.4';
    img.style.display = 'block';
    img.style.margin = '0 auto';

    const overlayText = document.createElement('div');
    overlayText.style.position = 'absolute';
    overlayText.style.top = '85%';
    overlayText.style.left = '50%';
    overlayText.style.transform = 'translate(-50%, -50%)';
    overlayText.style.zIndex = '2';
    overlayText.style.color = '#000';
    overlayText.style.fontSize = '18px';
    overlayText.style.textAlign = 'center';
    overlayText.style.padding = '10px';
    overlayText.style.whiteSpace = 'normal';
    overlayText.style.lineHeight = '1.4';

    // 굵은 첫 줄
    const boldLine = document.createElement('div');
    boldLine.textContent = (error_res.message === 'CHECK_TEXT_FAILED')
            ? '개인정보처리방침 및 수집이용동의서에 관한 내용이 아닙니다!'
            : '오류가 발생했습니다';
    boldLine.style.fontWeight = 'bold';

    // 일반 두 번째 줄
    const normalLine = document.createElement('div');
    normalLine.textContent = '다시 시도해주세요.';

    // 조립
    overlayText.appendChild(boldLine);
    overlayText.appendChild(normalLine);

    contentWrapper.appendChild(img);
    contentWrapper.appendChild(overlayText);
    result.appendChild(close_button);
    result.appendChild(contentWrapper);

    function outsideClickHandler(e) {
        if (!result.contains(e.target)) {
            result.remove();
            document.removeEventListener('mousedown', outsideClickHandler);
        }
    }
    setTimeout(() => {
        document.addEventListener('mousedown', outsideClickHandler);
    }, 0);
}


// 결과 화면 생성 코드 -> Loading 요소를 제거하고 결과 출력 요소들을 추가
function showResult(summary, detect){

    const result = document.getElementById('result-element'); //생성된 result 요소 정보를 가져옴
    if (!result) return;

    result.innerHTML = '';

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

    // category_name → 한글 변환 매핑 객체 생성 (수정) : 이 부분 가이드라인보고 정확하게 변경하기!
    const categoryNameMap = {
        processingPurpose: "개인정보 처리 목적",
        collectedItems: "처리하는 개인정보의 항목",
        childrenUnder14: "14세 미민 아동의 개인정보 처리에 관한 사항",
        retentionPeriod: "개인정보의 처리 및 보유 기간",
        destructionProcedure: "개인정보의 파기 절차 및 방법에 관한 사항",
        thirdPartySharing: "개인정보의 제3자 제공에 관한 사항",
        additionalUseCriteria: "추가적인 이용, 제공이 지속적으로 발생 시 판단 기준",
        outsourcingInfo: "개인정보 처리업무 위탁에 관한 사항",
        overseasTransfer: "개인정보의 국외수집 및 이전에 관한 사항",
        securityMeasures: "개인정보의 안전성 확보 조치에 관한 사항",
        sensitiveInfoDisclosure: "민감정보의 공개 가능성 및 비공개를 선택하는 방법",
        pseudonymizedInfo: "가명정보 처리에 관한 사항",
        autoCollectionDevices: "개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항",
        behavioralTrackingByThirdParties: "개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집,이용 및 거부에 관한 사항",
        dataSubjectRights: "정보주체와 법정대리인의 권리, 의무 및 행사 방법에 관한 사항",
        privacyOfficerInfo: "개인정보 보호책임자의 성명 또는 개인정보 업무 담당 부서 및 고충사항을 처리하는 부서에 관한 사항",
        domesticAgent: "국내대리인 지정에 관한 사항",
        remedyForInfringement: "정보주체의 권익침해에 대한 구제방법",
        fixedCCTVOperation: "고정형 영상정보처리기기 운영, 관리에 관한 사항",
        mobileCCTVOperation: "이동형 영상정보처리기기 운영, 관리에 관한 사항",
        optionalPrivacyClauses: "개인정보처리자가 개인정보 처리 기준 및 보호조치 등에 관하여 자율적으로 개인정보 처리방침에 포함하여 정한 사항",
        policyChanges: "개인정보처리방침의 변경에 관한 사항"
    };


    const detect_all_elements = document.createElement('div');
    const detect_header = document.createElement('div');
    const detect_title = document.createElement('h4');
    detect_title.textContent = '불공정 조항';

    detect_header.style.backgroundColor="#FFFBCA"
    detect_header.style.border = '1px solid #aaa';
    detect_header.style.borderRadius = '10px';
    detect_header.style.width = '120px';
    detect_header.style.height = '30px';
    detect_header.style.marginTop = '5px';
    detect_header.style.marginBottom = '5px';

    detect_header.style.display = 'flex';
    detect_header.style.alignItems = 'center';
    detect_header.style.justifyContent = 'center';


    detect_header.appendChild(detect_title);
    detect_all_elements.appendChild(detect_header);

    const detect_element = document.createElement('div');
    detect_element.style.backgroundColor = '#FFFFFF';
    detect_element.style.border = '1px solid #aaa';
    detect_element.style.borderRadius = '15px';

    //detect.data.result의 각각 items에 대해 detectItems.isUnfair의 값이 true인 경우만 배열에 담도록 -> itmes를
    // 불공정 조항만 필터링
    const unfair_result = detect.data.results.filter(item => item.detectItems.isUnfair === true);
    console.log("불공정 조항 데이터 필터링 결과 : ", unfair_result);

    if (unfair_result.length === 0) {
        const detect_category = document.createElement('span');
        detect_category.textContent = '탐지된 불공정 조항이 없습니다!';
        detect_element.appendChild(detect_category);
        detect_all_elements.appendChild(detect_element);
    } else {
        unfair_result.forEach(item => {
            // 개별 조항 컨테이너
            const item_container = document.createElement('div');
            item_container.style.marginBottom = '1em';

            const detect_category = document.createElement('span');
            const rawCategory = item.category;
            const readableCategory = categoryNameMap[rawCategory] || rawCategory;  // 매핑 없으면 원래 값 그대로
            detect_category.textContent = readableCategory;
            detect_category.style.fontWeight = 'bold';
            detect_category.style.display = 'block';

            const detect_content = document.createElement('div');
            detect_content.style.wordBreak = 'break-word';
            detect_content.style.overflowWrap = 'break-word';
            detect_content.style.whiteSpace = 'normal';
            detect_content.style.maxWidth = '100%';

            const detect_Statement = document.createElement('span');
            detect_Statement.textContent = `문제 진술: ${item.detectItems.problemStatement}`;
            detect_Statement.style.display = 'block';

            const detect_reason = document.createElement('span');
            detect_reason.textContent = `이유: ${item.detectItems.reason}`;
            detect_reason.style.display = 'block';

            const detect_legalBasis = document.createElement('span');
            detect_legalBasis.textContent = `법적 근거: ${item.detectItems.legalBasis}`;
            detect_legalBasis.style.display = 'block';

            detect_content.appendChild(detect_Statement);
            detect_content.appendChild(detect_reason);
            detect_content.appendChild(detect_legalBasis);

            item_container.appendChild(detect_category);
            item_container.appendChild(detect_content);
            detect_element.appendChild(item_container); // 전체 wrapper에 추가
        });

        detect_all_elements.appendChild(detect_element); // 마지막에 한 번만 append
    }


    //요약 결과 출력 코드
    const summary_all_elements = document.createElement('div');
    const summary_title = document.createElement('h4');
    summary_title.textContent = '요약';
    summary_title.className = 'text-sm font-semibold';

    const summary_header = document.createElement('div');
    summary_header.style.backgroundColor="#FFFBCA"
    summary_header.style.border = '1px solid #aaa';
    summary_header.style.borderRadius = '10px';
    summary_header.style.width = '120px';
    summary_header.style.height = '30px';
    summary_header.style.marginTop = '5px';
    summary_header.style.marginBottom = '5px';

    summary_header.style.display = 'flex';
    summary_header.style.alignItems = 'center';
    summary_header.style.justifyContent = 'center';

    summary_header.appendChild(summary_title);
    summary_all_elements.appendChild(summary_header);

    console.log("[summary 전체 결과] : ", summary.data.results);

    const summary_element = document.createElement('div');
    summary_element.style.backgroundColor = '#FFFFFF';
    summary_element.style.border = '1px solid #aaa';
    summary_element.style.borderRadius = '15px';

    //만약 출력한 데이터가 없다면 -> summary.data.result의 각각 item의 summaryItems[0].summarize_content의 값이 없다면
    // '요약 결과가 없습니다. 개인정보처리방침 및 수집이용동의서가 맞는지 확인해주세요!' 문구 출력
    // summarize_content가 빈 문자열이거나 undefined/null인 경우 제외
    const summary_result = summary.data.results.filter(item => {
        return item.summaryItems.length > 0 && item.summaryItems[0].summarize_content?.trim();
    });

    // 아무 내용도 없을 경우 메시지 출력
    if (summary_result.length === 0) {
        const empty_msg = document.createElement('span');
        empty_msg.textContent = '요약 결과가 없습니다. 개인정보처리방침 및 수집이용동의서가 맞는지 확인해주세요!';
        summary_all_elements.appendChild(empty_msg);
    }

    else{
        summary_result.forEach(item => { //각각의 데이터를 하나씩 출력한다.
            console.log("[summary 결과 : items] : ", item);

            const rawCategory = item.summaryItems[0].category_name;
            const readableCategory = categoryNameMap[rawCategory] || rawCategory;  // 매핑 없으면 원래 값 그대ro!
            const summary_category = document.createElement('span');
            summary_category.textContent = readableCategory;


            const summary_content = document.createElement('p');
            summary_content.style.wordBreak = 'break-word';
            summary_content.style.overflowWrap = 'break-word';
            summary_content.style.whiteSpace = 'normal';
            summary_content.style.maxWidth = '100%';
            summary_content.textContent = `${item.summaryItems[0].summarize_content}`;

            //생성한 요소를 추가한다.
            summary_element.appendChild(summary_category);
            summary_element.appendChild(summary_content);
            summary_all_elements.appendChild(summary_element);
        });
    }

    //화면에 생성한 요소들을(닫기버튼, 불공정 조항 결과, 요약 결과, 최종 결과창) 삽입
    result.appendChild(close_button);
    result.appendChild(detect_all_elements);
    result.appendChild(summary_all_elements);
    document.body.append(result);

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