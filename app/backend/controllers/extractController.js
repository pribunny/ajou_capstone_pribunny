const axios = require('axios');
const path = require('path');
const Tesseract = require('tesseract.js');
const convertToMarkdown = require('../utils/convertToMarkdown');
const https = require('https');

const extractController = async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ success: false, message: '파일 경로를 제공해 주세요.' });
    }

    const ext = path.extname(filePath).toLowerCase();

    let markdown = '';

    if (ext === '.pdf') {
      const modelServerUrl = 'http://10.0.3.118:8000/extract-text';
      const modelResponse = await axios.post(modelServerUrl, { filePath });

      if (!modelResponse.data.success) {
        return res.status(500).json({ success: false, message: '모델 서버에서 텍스트 추출 실패' });
      }

      markdown = modelResponse.data.text;
      console.log("\nPDF 마크다운 텍스트:\n", markdown);

    } else if (['.jpg', '.jpeg', '.png', '.bmp'].includes(ext)) {
      const ocrResult = await Tesseract.recognize(filePath, 'kor', {
        logger: () => {},
      });

      const extractedText = ocrResult.data.text;
      console.log("\nOCR로 추출한 텍스트:\n", extractedText);

      markdown = convertToMarkdown(extractedText);
      console.log("\n마크다운으로 변환한 값:\n", markdown);

    } else {
      return res.status(400).json({ success: false, message: '지원하지 않는 파일 형식입니다.' });
    }

    // 요약 API 호출
    const summaryResponse = await axios.post(
      'https://localhost:3000/api/summary?data_size=short',
      { summaryText: markdown },
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    );

    if (!summaryResponse.data || !summaryResponse.data.success) {
      return res.status(500).json({ success: false, message: '요약 API 응답 실패' });
    }

    // 프론트엔드에 요약 API 응답 그대로 전달
    return res.status(200).json(summaryResponse.data);

  } catch (error) {
    console.error('처리 중 오류:', error.message);
    return res.status(500).json({ success: false, message: '서버 처리 중 오류가 발생했습니다.' });
  }
};

module.exports = extractController;
