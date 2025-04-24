// utils/htmlParser.js

const cheerio = require("cheerio");

function splitHtmlToParagraphs(htmlContent) {
    const $ = cheerio.load(htmlContent);
    let paragraphs = [];

    // <p>, <h1>, <h2>, <h3> 태그를 기준으로 단락 나누기
    $('p, h1, h2, h3').each((index, element) => {
        const text = $(element).text().trim();
        if (text) {
            paragraphs.push(text);
        }
    });

    return paragraphs;
}

module.exports = { splitHtmlToParagraphs };
