const splitParagraphs = (markdownText, maxLength = 500) => {
  if (typeof markdownText !== 'string') return [];

  const headingPattern = /^(#+ .*)/gm;
  const matches = [...markdownText.matchAll(headingPattern)];

  const finalParagraphs = [];
  const seen = new Set();

  // 유니코드 정규화 + 공백 제거 함수
  const normalize = (text) =>
    text.normalize('NFKC').replace(/\s+/g, '');

  // 마침표 기준으로 문장을 분리해 maxLength 이하로 나누는 함수 (숫자+마침표 패턴 제외)
  const splitByLength = (text, maxLength) => {
    const sentences = [];
    let lastIndex = 0;
    const regex = /\.(\s+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const dotPos = match.index;

      // 마침표 앞 6글자 내외를 검사하여 **숫자. 또는 **숫자\. 패턴인지 확인
      const prevText = text.slice(Math.max(0, dotPos - 6), dotPos + 1);
      const numberPattern = /\s*\d+\\?\.?$/;

      if (numberPattern.test(prevText)) {
        // 숫자+마침표 패턴이면 분리하지 않고 계속
        continue;
      }

      // 분리 가능한 위치이므로 문장 추가
      sentences.push(text.slice(lastIndex, dotPos + 1).trim());
      lastIndex = dotPos + match[1].length; // 공백 포함 이동
    }

    // 마지막 남은 문장 추가
    if (lastIndex < text.length) {
      sentences.push(text.slice(lastIndex).trim());
    }

    // maxLength 기준으로 묶기
    const chunks = [];
    let buffer = '';

    for (const sentence of sentences) {
      if ((buffer + ' ' + sentence).trim().length <= maxLength) {
        buffer = (buffer + ' ' + sentence).trim();
      } else {
        if (buffer) chunks.push(buffer);
        buffer = sentence;
      }
    }

    if (buffer) chunks.push(buffer);

    return chunks;
  };

  const addUnique = (text) => {
    const normalized = normalize(text);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      finalParagraphs.push(text);
    }
  };

  // 1. h 태그(= #)가 있는 경우 기존 로직 수행
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const startIdx = matches[i].index;
      const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : markdownText.length;

      let paragraphBlock = markdownText.slice(startIdx, endIdx).trim();
      paragraphBlock = paragraphBlock.replace(/\s*\n\s*/g, ' ');

      if (!paragraphBlock) continue;

      if (paragraphBlock.includes('잡코리아 고객센터')) {
        const subParagraphs = paragraphBlock.split('----').map(p => p.trim()).filter(p => p);
        for (const subPara of subParagraphs) {
          const chunks = splitByLength(subPara, maxLength);
          chunks.forEach(addUnique);
        }
      } else {
        const chunks = splitByLength(paragraphBlock, maxLength);
        chunks.forEach(addUnique);
      }
    }
  } else {
    // 2. h 태그가 없는 경우
    const cleanedText = markdownText.replace(/\s*\n\s*/g, ' ').trim();

    if (cleanedText.includes('리핏')) {
      // '리핏' 포함 시 ■ 기준으로 분리 후 maxLength 단위로 나눔
      const parts = cleanedText.split('■').map(p => p.trim()).filter(p => p);
      for (const part of parts) {
        const chunks = splitByLength(part, maxLength);
        chunks.forEach(addUnique);
      }
    } else {
      // 일반적으로 마침표 기준으로 분리
      const chunks = splitByLength(cleanedText, maxLength);
      chunks.forEach(addUnique);
    }
  }

  return finalParagraphs;
};

module.exports = splitParagraphs;

