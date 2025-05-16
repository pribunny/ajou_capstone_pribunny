const convertToMarkdown = (text) => {
  // 1) 먼저 줄 중간에 끊긴 문장들을 문단 단위로 합침
  const combineLinesToParagraphs = (lines) => {
    const paragraphs = [];
    let buffer = '';

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed === '') {
        if (buffer) {
          paragraphs.push(buffer.trim());
          buffer = '';
        }
      } else {
        if (buffer === '') {
          buffer = trimmed;
        } else {
          // 문장이 마침표, 물음표, 느낌표 등으로 끝나지 않으면 이어 붙임
          if (!/[.?!"]$/.test(buffer)) {
            buffer += ' ' + trimmed;
          } else {
            paragraphs.push(buffer);
            buffer = trimmed;
          }
        }
      }
    });

    if (buffer) paragraphs.push(buffer.trim());

    return paragraphs;
  };

  // 2) 원본 텍스트를 줄 단위로 분리 후 문단 단위로 합침
  const lines = text.split('\n');
  const paragraphs = combineLinesToParagraphs(lines);

  const markdownLines = [];

  let tableBuffer = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;

    const tableRows = tableBuffer.map(line =>
      line.trim().split(/\s{2,}|\t+/).filter(Boolean)
    );

    if (tableRows.length < 2) {
      markdownLines.push(...tableBuffer);
      tableBuffer = [];
      return;
    }

    const header = '| ' + tableRows[0].join(' | ') + ' |';
    const separator = '| ' + tableRows[0].map(() => '---').join(' | ') + ' |';
    const body = tableRows.slice(1).map(row => '| ' + row.join(' | ') + ' |');

    markdownLines.push(header, separator, ...body);
    tableBuffer = [];
  };

  const convertToList = (line) => {
    return line.replace(/^(\d+\.|[가-힣]\.)\s*/, '- ');
  };

  paragraphs.forEach(paragraph => {
    const trimmed = paragraph.trim();

    if (trimmed === '') {
      flushTable();
      markdownLines.push('');
      return;
    }

    if (/\s{2,}|\t+/.test(paragraph)) {
      tableBuffer.push(paragraph);
      return;
    }

    flushTable();

    if (/^(1\.|2\.|3\.|4\.|5\.|제?\d+조|[가-힣]{2,}.{0,10}(약관|처리방침|정책|개인정보))/.test(trimmed)) {
      markdownLines.push(`### ${trimmed}`);
      return;
    }

    if (/^(\d+\.)|^([가-힣]\.)|^[\*\-\+]/.test(trimmed)) {
      markdownLines.push(convertToList(trimmed));
      return;
    }

    const linkProcessed = trimmed.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');

    markdownLines.push(linkProcessed);
  });

  flushTable();

  return markdownLines.join('\n');
};

module.exports = convertToMarkdown;
