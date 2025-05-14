const { JSDOM } = require("jsdom");
const TurndownService = require("turndown");

// 개인정보 처리방침에서 추출하고자 하는 섹션 패턴 목록 (정규식)
const TARGET_SECTIONS = [
  '개인정보.*처리.?목적',
  '개인정보.*보유.?기간',
  '개인정보파일.*(현황|등록|공개)',
  '개인정보.*제3자.*제공',
  '개인정보.*위탁',
  '개인정보.*파기.*(방법|절차)',
  '정보주체.*권리.*의무.*행사방법',
  '개인정보.*안전성.*확보조치',
  '자동.*수집.*장치.*거부',
  '개인정보.*보호책임자',
  '개인정보.*열람.*청구',
  '개인정보.*(정정|삭제|처리정지).*청구',
  '(정보주체.*)?권익.*구제방법',
  '개인정보.*처리방침.*변경',
  '14세.*아동.*개인정보',
  '개인정보.*영향평가',
  '가명정보.*처리',
  '민감정보.*공개',
  '개인정보.*보호수준',
];

// 주어진 텍스트가 대상 섹션 제목에 해당하는지 여부를 확인하는 함수
const isTargetSection = (text) => {
  for (const pattern of TARGET_SECTIONS) {
    const regex = new RegExp(pattern);
    if (regex.test(text)) return true;
  }
  return false;
};

// 개별 노드를 마크다운으로 변환하는 함수
const processNode = (node, processedNodes, turndownService) => {
  if (!node || processedNodes.has(node)) return ''; // 이미 처리한 노드는 건너뜀
  processedNodes.add(node);

  let md = '';

  // 제목 태그(H1~H6, STRONG, B)를 처리
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B'].includes(node.tagName)) {
    const level = parseInt(node.tagName.replace(/[^\d]/g, ''), 10) || 4; // STRONG, B는 4단계 제목으로 처리
    md += `\n\n${'#'.repeat(level)} ${node.textContent.trim()}\n`;
  } 
  // 목록, 문단, DIV 태그는 Turndown으로 변환
  else if (node.tagName === 'LI' || node.tagName === 'P' || node.tagName === 'DIV') {
    const html = node.outerHTML || `<p>${node.textContent.trim()}</p>`;
    md += `\n${turndownService.turndown(html)}\n`;
  } 
  // 기타 태그는 예외처리 포함해 Turndown 변환
  else {
    try {
      const html = node.outerHTML || `<p>${node.textContent.trim()}</p>`;
      md += `\n${turndownService.turndown(html)}\n`;
    } catch (e) {
      console.warn('⚠️ Turndown 오류:', e.message);
    }
  }

  return md;
};

// HTML 전체를 마크다운으로 변환하는 메인 함수
const htmlToMarkdown = (htmlString) => {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b')]; // 제목 계열 태그 전체 수집
  const turndownService = new TurndownService();
  const processedNodes = new Set();        // 변환 완료된 노드 관리
  const processedCentralNodes = new Set(); // 중심 노드(대제목) 관리
  let result = '';

  // TARGET_SECTIONS에 해당하는 중심 노드 필터링
  const centralNodes = headings.filter(h => isTargetSection(h.textContent.trim()) && /^H[1-6]$/.test(h.tagName));

  // 중심 노드의 레벨과 속성값 기반으로 키 생성
  const attributeKeys = new Set();
  centralNodes.forEach(h => {
    if (/^H[1-6]$/.test(h.tagName)) {
      const level = parseInt(h.tagName[1]);
      const key = `level-${level}|class=${h.getAttribute('class') || ''}|id=${h.getAttribute('id') || ''}`;
      attributeKeys.add(key);
    }
  });

  // 중심 노드 기준으로 인접한 레벨의 제목 태그들도 수집
  const levelMatchedNodes = [];
  centralNodes.forEach(central => {
    const currentLevel = parseInt(central.tagName[1]);
    const validLevels = [currentLevel - 1, currentLevel + 1, currentLevel].filter(l => l >= 1 && l <= 6);

    headings.forEach(h => {
      const level = parseInt(h.tagName[1]);
      if (validLevels.includes(level)) {
        levelMatchedNodes.push(h);
      }
    });
  });

  // 중심 노드 + 인접 레벨 노드 합치기
  const combinedNodes = [...centralNodes, ...levelMatchedNodes];

  // 중복 제거 (tag, class, id, 텍스트 기준)
  const seen = new Set();
  const uniqueNodes = combinedNodes.filter(h => {
    const key = `${h.tagName}|${h.getAttribute('class') || ''}|${h.getAttribute('id') || ''}|${h.textContent.trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filteredUniqueNodes = uniqueNodes.filter(h => {
    const text = h.textContent.trim();
    const tag = h.tagName;
    const cls = h.getAttribute('class') || '';
    const id = h.getAttribute('id') || '';

    // 카카오 필터링 조건
    const isKakaoPolicy = text === '카카오 개인정보 처리방침' && tag === 'H3' && cls === 'screen_out';

    // 네이버 필터링 조건 1: 네이버에서만 제공하는 특별한 개인정보처리방침
    const isNaverSpecialPolicy = text === '네이버에서만 제공하는 특별한 개인정보처리방침' && tag === 'H3' && cls === 'sp' && id === '';

    // 네이버 필터링 조건 2: 네이버 개인정보처리방침
    const isNaverPolicy = text === '네이버 개인정보처리방침' && tag === 'H3' && cls === '' && id === '';

    // 위 3가지에 해당하는 경우 제외
    return !(isKakaoPolicy || isNaverSpecialPolicy || isNaverPolicy);
  });

  // 🔽🔽🔽 중복 제거 후 최종 노드 목록 출력 🔽🔽🔽
  console.log('▶ 중복 제거 후 uniqueNodes 목록');
  filteredUniqueNodes.forEach(h => {
    console.log(`- [${h.tagName}] ${h.textContent.trim()} (class="${h.getAttribute('class') || ''}", id="${h.getAttribute('id') || ''}")`);
  });

  // 각 중심 노드 기준으로 하위 노드 및 형제 노드 처리
  filteredUniqueNodes.forEach(heading => {
    if (processedCentralNodes.has(heading)) return;

    result += processNode(heading, processedNodes, turndownService);
    processedCentralNodes.add(heading);

    const childNodes = [...heading.children];

    // 자식 노드가 있으면 자식 노드부터 처리
    if (childNodes.length > 0) {
      childNodes.forEach(c => result += processNode(c, processedNodes, turndownService));
    }

    // 자식 노드 처리 후에도 형제 노드를 계속 처리
    let sibling = heading.nextElementSibling;
    while (sibling) {
      const isNextCentralNode = filteredUniqueNodes.includes(sibling);
      if (isNextCentralNode) {
        // 다른 중심 노드가 나오면 반복 종료
        break;
      }

      result += processNode(sibling, processedNodes, turndownService);
      sibling = sibling.nextElementSibling;
    }

    // 형제 노드가 거의 없는 경우, 부모의 다음 형제 노드를 추가로 확인
    const siblingTextSum = [...heading.nextElementSibling?.children || []].reduce((sum, el) => sum + el.textContent.trim().length, 0);
    if (siblingTextSum < 10) {
      const parent = heading.parentElement;
      let parentSibling = parent?.nextElementSibling;
      let parentSiblingCount = 0;

      while (parentSibling && parentSiblingCount < 2) {
        if (parentSibling.textContent.trim().length > 0) {
          result += processNode(parentSibling, processedNodes, turndownService);
        }
        parentSibling = parentSibling.nextElementSibling;
        parentSiblingCount++;
      }
    }


    // 이미 처리한 중심 노드는 삭제
    heading.remove();
  });

    return result.trim();
};

module.exports = htmlToMarkdown;