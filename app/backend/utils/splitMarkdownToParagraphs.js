function splitMarkdownToParagraphs(input) {
  const lines = Array.isArray(input) ? input : input.split(/\r?\n/);

  const paragraphs = [];
  let currentParagraph = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // ### 로 시작하면 문단 분리
    if (trimmedLine.startsWith('### ')) {
      if (currentParagraph.trim()) {
        // 변수 값을 배열에 넣음
        paragraphs.push(currentParagraph.trim());
      }
      currentParagraph = trimmedLine;
    } else {
      currentParagraph += ' ' + trimmedLine;
    }
  });

  // 마지막 문단 처리
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs;
}

module.exports = splitMarkdownToParagraphs;
