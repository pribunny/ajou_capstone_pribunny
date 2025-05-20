const splitParagraphs = (markdownText) => {
  if (typeof markdownText !== 'string') return [];

  const headingPattern = /^(#+ .*)/gm;

  const matches = [...markdownText.matchAll(headingPattern)];

  const finalParagraphs = [];

  // 문단을 분리
  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index;
    const endIdx = (i + 1 < matches.length) ? matches[i + 1].index : markdownText.length;

    const heading = matches[i][0];
    const body = markdownText.slice(startIdx + heading.length, endIdx).trim();

    if (body) {
      finalParagraphs.push(`${heading}\n${body}`);
    } else {
      finalParagraphs.push(heading);
    }
  }

  // 중복 제거 (이스케이프 문자 \ 무시)
  const uniqueParagraphs = [];
  const seen = new Set();

  finalParagraphs.forEach(paragraph => {
    const first50Chars = paragraph.slice(0, 50);  // 첫 50자
    const remaining = paragraph.slice(50);        // 나머지 부분

    let isDuplicate = false;

    // 이미 존재하는 문단 중에서 나머지 부분이 포함된 문단이 있는지 확인
    seen.forEach(existing => {
      // 나머지 부분이 기존 문단에 포함되거나, 기존 문단이 나머지 부분에 포함될 경우 중복으로 판단
      if (existing.includes(remaining) || remaining.includes(existing)) {
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      uniqueParagraphs.push(paragraph); // 원본 그대로 추가
      seen.add(remaining); // 나머지 부분을 Set에 추가하여 중복 방지
    }
  });

  return uniqueParagraphs;
};

module.exports = splitParagraphs;
