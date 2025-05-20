const { JSDOM } = require("jsdom");
const TurndownService = require("turndown");

// 개인정보 처리방침 관련 주요 섹션명 패턴 리스트
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
  '개인정보.*보호 권리',
];

const isTargetSection = (text) => {
  return TARGET_SECTIONS.some(pattern => new RegExp(pattern).test(text));
};

// 텍스트 중복 체크용 정규화 함수
const normalizeTextForDuplicateCheck = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\*\*/g, '')                     // 마크다운 볼드(**) 제거
    .replace(/[_~`>#+\-\[\]\(\)!]/g, '')     // 마크다운 특수문자 제거
    .replace(/\s+/g, ' ')                     // 공백 여러 개를 한 칸으로
    .trim();
};

// 중심노드 중복 판단
const isDuplicateCenterNode = (node, existingNodes) => {
  const nodeLevel = parseInt(node.tagName.replace('H', ''), 10);
  const nodeNormalizedText = normalizeTextForDuplicateCheck(node.textContent.trim());

  for (const existNode of existingNodes) {
    const existLevel = parseInt(existNode.tagName.replace('H', ''), 10);
    const existNormalizedText = normalizeTextForDuplicateCheck(existNode.textContent.trim());

    if (nodeLevel === existLevel && nodeNormalizedText === existNormalizedText) {
      return true;
    }
  }
  return false;
};

// 중심노드 다음 나올 때까지 노드 수집 (DFS, 중심 노드 기준)
const collectUntilNextCenter = (startNode, centerNodesSet, processedNodes) => {
  const collected = new Set();
  let shouldStop = false;

  const dfs = (node) => {
    if (!node || collected.has(node) || processedNodes.has(node) || shouldStop) return;
    if (centerNodesSet.has(node) && node !== startNode) {
      shouldStop = true;
      return;
    }

    collected.add(node);

    // 자식 노드 순회
    for (const child of node.childNodes || []) {
      dfs(child);
      if (shouldStop) return;
    }
  };

  // startNode 자식부터 DFS 수행
  for (const child of startNode.childNodes || []) {
    dfs(child);
    if (shouldStop) break;
  }

  // 이후 형제 노드들도 포함
  let sibling = startNode.nextElementSibling;
  while (sibling && !shouldStop) {
    dfs(sibling);
    sibling = sibling.nextElementSibling;
  }

  // 상위 부모의 다음 형제 노드들 포함 (상위 레벨 포함해서 수집)
  let parent = startNode.parentElement;
  while (parent && !shouldStop) {
    let pSibling = parent.nextElementSibling;
    while (pSibling && !shouldStop) {
      dfs(pSibling);
      pSibling = pSibling.nextElementSibling;
    }
    parent = parent.parentElement;
  }

  return collected;
};

// 중복 방지 + 부모가 처리된 텍스트 포함 고려하여 마크다운 변환
const convertNodeToMarkdown = (node, turndownService, processedNodes, processedTexts) => {
  if (!node || processedNodes.has(node)) return '';

  // ❗️elementor 주석 또는 해당 문자열 포함된 노드 무시
  if (
    node.nodeType === 8 && node.data.includes('elementor') || // 주석 노드
    node.textContent?.includes('*! elementor -') ||           // 텍스트 내 포함
    node.outerHTML?.includes('*! elementor -')                // HTML 내 포함
  ) {
    return '';
  }

  // undefined 태그명 노드는 무시
  if (!node.tagName) return '';

  // 부모 노드에 이미 포함된 텍스트라면 중복 방지
  let parent = node.parentElement;
  while (parent) {
    if (processedNodes.has(parent)) {
      const parentTextNorm = normalizeTextForDuplicateCheck(parent.textContent.trim());
      const nodeTextNorm = normalizeTextForDuplicateCheck(node.textContent.trim());
      if (parentTextNorm.includes(nodeTextNorm)) {
        return '';  // 부모가 이미 처리한 텍스트라 중복 방지
      }
    }
    parent = parent.parentElement;
  }

  // 텍스트 정규화하여 중복 체크
  const textNormalized = normalizeTextForDuplicateCheck(node.textContent.trim());
  if (processedTexts.has(textNormalized)) {
    return '';
  }

  processedNodes.add(node);
  processedTexts.add(textNormalized);

  const tag = node.tagName.toUpperCase();

  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'B'].includes(tag)) {
    const level = parseInt(tag.replace(/[^\d]/g, ''), 10) || 4;
    return `\n\n${'#'.repeat(level)} ${node.textContent.trim()}\n`;
  } else {
    // <p> 태그 유지 + 텍스트 포함, turndown 처리
    const html = node.outerHTML || `<p>${node.textContent.trim()}</p>`;
    return `\n${turndownService.turndown(html)}\n`;
  }
};

// 사이트별 제외 규칙
const excludedMapBySite = {
  default: new Map([
    ['H3', ['개인정보 처리방침']]
  ]),
  naver: new Map([
    ['H3', ['네이버에서만 제공하는 특별한 개인정보처리방침', '네이버 개인정보처리방침']],
    ['H5', ['수집하는 항목', '수집 목적']],
  ]),
  seoul: new Map([
    ['H3', ['개인정보 처리방침']],
    ['H4', ['서울시 개인정보 처리방침 쉽게 알기', '공유하기 레이어']],
    ['H5', ['개인정보란?', '여러분의 개인정보는 수집 → 이용 → 위탁/제공 → 파기 단계로 관리되고 있어요.', '수집', '이용', '위탁/제공', '파기', '권리·의무 행사방법', '자! 해치가 준비한 서울시의 개인정보 처리방침 소개는 여기까지예요~', '개인정보 열람청구, 정정·삭제, 처리정지 청구 절차']],
    ['H6', ['위탁이란', '제공이란']]
  ]),
  privacyPortal: new Map([
    ['H4', ['통합인증', '개인정보 포털 주요 서비스', '자주 이용하는 서비스 바로가기', '개인정보보호위원회 <개인정보 포털> 개인정보 처리방침', '주요 개인정보 처리 표시(라벨링)', '목차', '']],
  ]),
  coupang: new Map([
    ['H4', ['개인정보처리방침', 'Easy 개인정보처리방침', '공지사항']],
    ['H5', ['*']]  
  ]),
  kbbank: new Map([
    ['H3', ['개인', '기업', '자산관리', '부동산', '퇴직연금', '카드', '전체서비스', 'GLOBAL']],
    ['H4', ['*']]  
  ]),
  samsung: new Map([
    ['H3', ['제품', '기획전/혜택', '고객서비스', '지속가능경영', '회사소개', '부가정보', '윤리&준법경영']],
    ['H4', ['*']] 
  ]),
};

function getExcludedMap(htmlString) {
  const dom = new JSDOM(htmlString);
  const bodyText = dom.window.document.body.textContent;

  // 디버깅을 위한 helper 함수
  function logMatch(keyword, contextRange = 30) {
    const idx = bodyText.indexOf(keyword);
    if (idx !== -1) {
      const context = bodyText.slice(
        Math.max(0, idx - contextRange),
        idx + keyword.length + contextRange
      );
      console.log(`📍 키워드 "${keyword}" 발견 위치:`, idx);
      console.log(`🔎 주변 텍스트: "...${context}..."`);
    } else {
      console.log(`❌ 키워드 "${keyword}"는 본문에 없음.`);
    }
  }

  if (bodyText.includes('네이버 고객센터')) {
    logMatch('네이버 고객센터');
    console.log('📌 [getExcludedMap] 네이버 맵 사용');
    return excludedMapBySite.naver;
  }
  if (bodyText.includes('서울시 개인정보 처리방침 쉽게 알기')) {
    logMatch('서울시 개인정보 처리방침 쉽게 알기');
    console.log('📌 [getExcludedMap] 서울특별시 맵 사용');
    return excludedMapBySite.seoul;
  }
  if (bodyText.includes('개인정보 포털 주요')) {
    logMatch('개인정보 포털 주요');
    console.log('📌 [getExcludedMap] 개인정보포털 맵 사용');
    return excludedMapBySite.privacyPortal;
  }
  if (bodyText.includes('쿠팡 개인정보처리방침')) {
    logMatch('쿠팡 개인정보처리방침');
    console.log('📌 [getExcludedMap] 쿠팡 맵 사용');
    return excludedMapBySite.coupang;
  }
  if (bodyText.includes('KB국민은행은 다음의 목적을 위하여')) {
    logMatch('KB국민은행은 다음의 목적을 위하여');
    console.log('📌 [getExcludedMap] 국민은행 맵 사용');
    return excludedMapBySite.kbbank;
  }
  if (bodyText.includes('삼성계정 비로그인 회원')) {
    logMatch('삼성계정 비로그인 회원');
    console.log('📌 [getExcludedMap] 삼성 맵 사용');
    return excludedMapBySite.samsung;
  }
  
  console.log('📌 [getExcludedMap] 기본 맵 사용 (매칭된 키워드 없음)');
  return excludedMapBySite.default;
}

function cleanMarkdownIfNeeded(bodyText, markdownText) {
  function logMatch(keyword, contextRange = 30) {
    const idx = bodyText.indexOf(keyword);
    if (idx !== -1) {
      const context = bodyText.slice(
        Math.max(0, idx - contextRange),
        idx + keyword.length + contextRange
      );
      console.log(`📍 키워드 "${keyword}" 발견 위치:`, idx);
      console.log(`🔎 주변 텍스트: "...${context}..."`);
    } else {
      console.log(`❌ 키워드 "${keyword}"는 본문에 없음.`);
    }
  }

  if (bodyText.includes('개인정보 포털 주요')) {
    logMatch('개인정보 포털 주요');
    console.log('📌 개인정보포털 맵 사용');

    const cutPoint = markdownText.indexOf('**분쟁조정 신청**');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('서울시 개인정보 처리방침 쉽게 알기')) {
    logMatch('서울시 개인정보 처리방침 쉽게 알기');
    console.log('📌  서울특별시 맵 사용');

    const cutPoint = markdownText.indexOf('이 게시물은 **공공누리 제4유형(출처표시 + 상업적 이용금지 + 변경금지)** 조건에 따라 자유롭게 이용이 가능합니다.');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('네이버 고객센터')) {
    logMatch('네이버 고객센터');
    console.log('📌 네이버 맵 사용');

    const cutPoint = markdownText.indexOf('[이전 개인정보처리방침 전체 목록 보기]');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('카카오 개인정보 처리방침')) {
    logMatch('카카오 개인정보 처리방침');
    console.log('📌 카카오 맵 사용');

    const cutPoint = markdownText.indexOf('#### 변경 전 개인정보 처리방침 보기');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  // 쿠팡 관련 제거 처리 예시
  if (bodyText.includes('쿠팡 개인정보처리방침')) {
    logMatch('쿠팡 개인정보처리방침');
    console.log('📌쿠팡 맵 사용');

    const cutPoint = markdownText.indexOf('#### 3\\. 이용자의 동의없는 이용 및 제공');
    if (cutPoint !== -1) {
      markdownText = markdownText.slice(0, cutPoint).trim();
    }

    // 2) "다른 버전 보기"부터 "개인정보 제3자제공 현황(국외)"까지 삭제
    const startKeyword = '다른 버전 보기';
    const endKeyword = '개인정보 제3자제공 현황(국외)';

    const startIdx = markdownText.indexOf(startKeyword);
    const endIdx = markdownText.indexOf(endKeyword);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      markdownText = markdownText.slice(0, startIdx) + markdownText.slice(endIdx + endKeyword.length);
      markdownText = markdownText.trim();
    }
    return markdownText;
  }

  if (bodyText.includes('농협중앙회는 다음의 목적을 위하여')) {
    logMatch('농협중앙회는 다음의 목적을 위하여');
    console.log('📌 농협중앙회 맵 사용');

    const cutPoint = markdownText.indexOf('아래에서 확인하실 수 있습니다.');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('교보 관계사')) {
    logMatch('교보 관계사');
    console.log('📌 교보문고 맵 사용');

    const cutPoint = markdownText.indexOf('개인정보처리방침 V1.0');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('아주대학교는 법령의 규정과')) {
    logMatch('아주대학교는 법령의 규정과');
    console.log('📌 아주대학교 맵 사용');

    const cutPoint = markdownText.indexOf('[개정 이력 다운로드]');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  // 국민 은행 관련 제거 처리 예시
  if (bodyText.includes('KB국민은행은 다음의 목적을 위하여')) {
    logMatch('KB국민은행은 다음의 목적을 위하여');
    console.log('📌국민은행 맵 사용');

    const cutPoint = markdownText.indexOf('개정사항 비교표 보기 버튼으로 이전 개인정보처리방침 대비 변경 이력을 확인하실 수 있습니다.');
    if (cutPoint !== -1) {
      markdownText = markdownText.slice(0, cutPoint).trim();
    }

    // 2) "다른 버전 보기"부터 "개인정보 제3자제공 현황(국외)"까지 삭제
    const startKeyword = '[키워드검색](#)';
    const endKeyword = '개인정보처리방침(2025년 4월 25일 개정)';

    const startIdx = markdownText.indexOf(startKeyword);
    const endIdx = markdownText.indexOf(endKeyword);

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      markdownText = markdownText.slice(0, startIdx) + markdownText.slice(endIdx + endKeyword.length);
      markdownText = markdownText.trim();
    }
    return markdownText;
  }
  if (bodyText.includes('삼성계정 비로그인 회원')) {
    logMatch('삼성계정 비로그인 회원');
    console.log('📌 삼성 맵 사용');

    const cutPoint = markdownText.indexOf('회사는 이외에도 제품 수리');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  if (bodyText.includes('지그재그 공유 리워드')) {
    logMatch('지그재그 공유 리워드');
    console.log('📌 지그재그 맵 사용');

    const cutPoint = markdownText.indexOf('###### 이전 이용자 개인정보 처리방침 확인하기');
    if (cutPoint !== -1) {
      return markdownText.slice(0, cutPoint).trim();  // 이후 제거
    }
  }
  
  return markdownText; // 조건 미충족 시 원본 유지
}
const htmlToMarkdown = (htmlString) => {

  // 🔧 스크립트 태그 제거
  htmlString = htmlString.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  const bodyText = document.body.textContent;
  const turndownService = new TurndownService();
  const allHeadings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];

  // 1) 키워드에 맞는 노드 필터링
  const targetNodes = allHeadings.filter(h => isTargetSection(h.textContent.trim()));
  
  // 🔍 키워드 기반 중심 노드 목록 로그 출력
  console.log('🔑 키워드 기반 중심 노드 목록:');
  targetNodes.forEach((node, idx) => {
    console.log(`${idx + 1}. [${node.tagName}] ${node.textContent.trim()}`);
  });

  // === 예외 처리 추가 ===
  if (targetNodes.length === 0) {
    throw new Error('해당 페이지는 처리할 수 없습니다. (기술적 이슈)');
  }

  // 2) 중심 노드 확장: ±1 레벨 (네이버만), 아니면 동일 레벨만
  const expandedCenterNodes = [];
  const isNaver = htmlString.toLowerCase().includes('네이버 고객센터');
  const excludedMap = getExcludedMap(htmlString);

  // 중심 노드 확장
  targetNodes.forEach(baseNode => {
    const baseLevel = parseInt(baseNode.tagName.replace('H', ''), 10);

    allHeadings.forEach(h => {
      const level = parseInt(h.tagName.replace('H', ''), 10);

      const levelCondition = isNaver
        ? Math.abs(level - baseLevel) <= 1
        : level === baseLevel;

      if (levelCondition && !isDuplicateCenterNode(h, expandedCenterNodes)) {
        expandedCenterNodes.push(h);
      }
    });
  });

  // 🔍 확장된 중심 노드 목록 출력
  console.log('🔎 확장된 중심 노드 목록 (중복 제거 + 레벨 조건 포함):');
  expandedCenterNodes.forEach((node, idx) => {
    console.log(`${idx + 1}. [${node.tagName}] ${node.textContent.trim()}`);
  });

   //중심 노드 제거: excludedMap 기준
  const filteredCenterNodes = expandedCenterNodes.filter(h => {
    const tag = h.tagName.toUpperCase(); // 항상 대문자로
    const text = h.textContent.trim();
    const excludedTexts = excludedMap.get(tag);

    const shouldExclude = excludedTexts && (excludedTexts.includes('*') || excludedTexts.includes(text));
    if (shouldExclude) {
      console.log(`🚫 제외된 중심 노드: [${tag}] "${text}"`);
    }
    return !shouldExclude;
  });

  // 🔍 필터링 후 중심 노드 목록 출력
  console.log('\n✅ 최종 중심 노드 목록 (제외 조건 적용됨):');
  filteredCenterNodes.forEach((node, idx) => {
    console.log(`${idx + 1}. [${node.tagName}] ${node.textContent.trim()}`);
  });

  const centerNodesSet = new Set(filteredCenterNodes);

  let result = '';
  const processedNodes = new Set();
  const processedTexts = new Set();

  for (const centerNode of filteredCenterNodes) {
    console.log(`\n📌 중심 노드 처리 시작: [${centerNode.tagName}] ${centerNode.textContent.trim()}`);

    result += convertNodeToMarkdown(centerNode, turndownService, processedNodes, processedTexts);

    const contentNodes = collectUntilNextCenter(centerNode, centerNodesSet, processedNodes);

    for (const node of contentNodes) {
      const preview = (node.textContent || '').trim().slice(0, 30);
      //console.log(`  ↳ 처리 중인 노드: <${node.tagName || 'undefined'}> "${preview}..."`);
      result += convertNodeToMarkdown(node, turndownService, processedNodes, processedTexts);
    }
  }
  
  result = cleanMarkdownIfNeeded(bodyText, result);


  return result.trim();
};

module.exports = htmlToMarkdown;
