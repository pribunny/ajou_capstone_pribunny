// const splitParagraphs = (markdownText) => {
//   if (typeof markdownText !== 'string') return [];

//   const headingPattern = /^(#+ .*)/gm;
//   const matches = [...markdownText.matchAll(headingPattern)];

//   const finalParagraphs = [];
//   const seen = new Set();

//   // 유니코드 정규화 + 공백 제거 함수
//   const normalize = (text) =>
//     text.normalize('NFKC').replace(/\s+/g, ''); // 모든 공백 제거

//   for (let i = 0; i < matches.length; i++) {
//     const startIdx = matches[i].index;
//     const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : markdownText.length;

//     let paragraphBlock = markdownText.slice(startIdx, endIdx).trim();
//     paragraphBlock = paragraphBlock.replace(/\s*\n\s*/g, ' '); 

//     if (!paragraphBlock) continue;

//     // "잡코리아" 포함 시 ---- 기준으로 다시 분리
//     if (paragraphBlock.includes('잡코리아 고객센터')) {
//       const subParagraphs = paragraphBlock.split('----').map(p => p.trim()).filter(p => p);
//       for (const subPara of subParagraphs) {
//         const normalized = normalize(subPara);
//         if (!seen.has(normalized)) {
//           seen.add(normalized);
//           finalParagraphs.push(subPara);
//         }
//       }
//     } else {
//       const normalized = normalize(paragraphBlock);
//       if (!seen.has(normalized)) {
//         seen.add(normalized);
//         finalParagraphs.push(paragraphBlock);
//       }
//     }
//   }

//   return finalParagraphs;
// };

// module.exports = splitParagraphs;

const splitParagraphs = (markdownText, maxLength = 500) => {
  if (typeof markdownText !== 'string') return [];

  const headingPattern = /^(#+ .*)/gm;
  const matches = [...markdownText.matchAll(headingPattern)];

  const finalParagraphs = [];
  const seen = new Set();

  // 유니코드 정규화 + 공백 제거 함수
  const normalize = (text) =>
    text.normalize('NFKC').replace(/\s+/g, ''); // 모든 공백 제거

  // 마침표 기준으로 문장을 분리해 maxLength 이하로 나누는 함수
  const splitByLength = (text, maxLength) => {
    const sentences = text.split(/(?<=\.)\s+/); // 마침표+공백 기준으로 문장 분리
    const chunks = [];
    let buffer = '';

    for (const sentence of sentences) {
      if ((buffer + sentence).length <= maxLength) {
        buffer += sentence + ' ';
      } else {
        if (buffer.trim()) chunks.push(buffer.trim());
        buffer = sentence + ' ';
      }
    }

    if (buffer.trim()) chunks.push(buffer.trim());
    return chunks;
  };

  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index;
    const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : markdownText.length;

    let paragraphBlock = markdownText.slice(startIdx, endIdx).trim();
    paragraphBlock = paragraphBlock.replace(/\s*\n\s*/g, ' '); 

    if (!paragraphBlock) continue;

    const addUnique = (text) => {
      const normalized = normalize(text);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        finalParagraphs.push(text);
      }
    };

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

  return finalParagraphs;
};

module.exports = splitParagraphs;
