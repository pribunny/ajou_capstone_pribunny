function splitMarkdownToParagraphs(input) {
  const lines = Array.isArray(input) ? input : input.split(/\r?\n/);

  const paragraphs = [];
  let currentParagraph = '';

  const flushParagraph = () => {
    const trimmed = currentParagraph.trim();
    if (trimmed.length <= 500) {
      paragraphs.push(trimmed);
    } else {
      // 500자를 넘는 경우 마침표 기준으로 나눈다
      const sentences = trimmed.split(/(?<=\.)\s+/); // 마침표 뒤 공백 기준 분할
      let temp = '';
      sentences.forEach(sentence => {
        if ((temp + sentence).length <= 500) {
          temp += (temp ? ' ' : '') + sentence;
        } else {
          if (temp) paragraphs.push(temp.trim());
          temp = sentence;
        }
      });
      if (temp) paragraphs.push(temp.trim());
    }
    currentParagraph = '';
  };

  lines.forEach(line => {
    const trimmedLine = line.trim();

    if (/^#{1,6} /.test(trimmedLine)) {
      if (currentParagraph.trim()) {
        flushParagraph();
      }
      currentParagraph = trimmedLine;
    } else {
      currentParagraph += ' ' + trimmedLine;
    }
  });

  if (currentParagraph.trim()) {
    flushParagraph();
  }

  return paragraphs;
}

module.exports = splitMarkdownToParagraphs;
