const cheerio = require("cheerio");

function splitHtmlToParagraphs(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const paragraphs = [];
    const headingTags = ['h1', 'h2', 'h3'];
    let currentParagraph = [];

    $('body')
        .find('*')
        .each((_, element) => {
            const tag = element.tagName?.toLowerCase();

            if (headingTags.includes(tag)) {
                if (currentParagraph.length > 0) {
                    paragraphs.push(currentParagraph.join('\n'));
                    currentParagraph = [];
                }
                currentParagraph.push($(element).text().trim());
            } else if (['p', 'li', 'div', 'span'].includes(tag)) {
                const text = $(element).text().trim();
                if (text.length > 0) currentParagraph.push(text);
            }
        });

    if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join('\n'));
    }

    return paragraphs;
}

module.exports = { splitHtmlToParagraphs };
