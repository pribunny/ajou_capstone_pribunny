const splitParagraphs = (markdownText) => {
  if (typeof markdownText !== 'string') return [];

  const headingPattern = /^(#+ .*)/gm;
  const matches = [...markdownText.matchAll(headingPattern)];

  const finalParagraphs = [];
  const seen = new Set();

  // 유니코드 정규화 + 공백 제거 함수
  const normalize = (text) =>
    text.normalize('NFKC').replace(/\s+/g, ''); // 모든 공백 제거

  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index;
    const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : markdownText.length;

    let paragraphBlock = markdownText.slice(startIdx, endIdx).trim();
    paragraphBlock = paragraphBlock.replace(/\s*\n\s*/g, ' '); 

    if (!paragraphBlock) continue;

    // "잡코리아" 포함 시 ---- 기준으로 다시 분리
    if (paragraphBlock.includes('잡코리아 고객센터')) {
      const subParagraphs = paragraphBlock.split('----').map(p => p.trim()).filter(p => p);
      for (const subPara of subParagraphs) {
        const normalized = normalize(subPara);
        if (!seen.has(normalized)) {
          seen.add(normalized);
          finalParagraphs.push(subPara);
        }
      }
    } else {
      const normalized = normalize(paragraphBlock);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        finalParagraphs.push(paragraphBlock);
      }
    }
  }

  return finalParagraphs;
};

module.exports = splitParagraphs;
