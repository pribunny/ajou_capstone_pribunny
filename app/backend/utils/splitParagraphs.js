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

    const paragraphBlock = markdownText.slice(startIdx, endIdx).trim();

    if (paragraphBlock) {
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
