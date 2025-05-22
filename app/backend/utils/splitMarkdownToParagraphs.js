function splitMarkdownToParagraphs(input) {
  const lines = Array.isArray(input) ? input : input.split(/\r?\n/);

  const paragraphs = [];
  let currentParagraph = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // #, ##, ### ... 등 헤더가 있으면 문단 분리
    if (/^#{1,6} /.test(trimmedLine)) {
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
      }
      currentParagraph = trimmedLine;
    } else {
      currentParagraph += ' ' + trimmedLine;
    }
  });

  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs;
}

module.exports = splitMarkdownToParagraphs;
