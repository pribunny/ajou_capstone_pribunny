const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const path = require('path');
const https = require('https');
const convertToMarkdown = require('../utils/convertToMarkdown');
const streamToBuffer = require('../utils/streamToBuffer');
const splitMarkdownToParagraphs = require('../utils/splitMarkdownToParagraphs');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getMimeTypeByMagic = (buffer) => {
  const header = buffer.slice(0, 4).toString('hex').toUpperCase();
  if (header.startsWith('25504446')) return 'pdf'; // %PDF
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpg'; // JPEG
  if (header.startsWith('89504E47')) return 'png'; // PNG
  return 'unknown';
};

const errorResponse = (res, code, message, status = 400) => {
  return res.status(status).json({
    success: false,
    code,
    message,
    responseTime: new Date().toISOString()
  });
};

const analyzeController = async (req, res) => {
  try {
    const { filename, filetype } = req.body;

    if (!filename || !filetype) {
      return errorResponse(res, 'MISSING_PARAMS', 'filename과 filetype은 필수입니다.');
    }

    // 1. S3에서 파일 다운로드
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
    });
    const s3Response = await s3Client.send(getCommand);
    const fileBuffer = await streamToBuffer(s3Response.Body);

    // 2. 확장자와 magic number 기반 MIME 검사
    const mimeByMagic = getMimeTypeByMagic(fileBuffer);
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    const claimedType = filetype.toLowerCase();

    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];

    if (!allowedTypes.includes(claimedType)) {
      return errorResponse(res, 'UNSUPPORTED_FILETYPE', '지원하지 않는 filetype입니다.');
    }

    if (claimedType !== mimeByMagic && !(claimedType === 'jpeg' && mimeByMagic === 'jpg')) {
      return errorResponse(
        res,
        'MISMATCH_FILETYPE',
        `파일의 실제 형식(${mimeByMagic})이 요청한 형식(${claimedType})과 일치하지 않습니다.`
      );
    }

    let markdown = '';
    let paragraphs = [];

    if (mimeByMagic === 'pdf') {
      const modelServerUrl = `http://${process.env.MODEL_SERVER_IP}:8000/extract-text`;

      const modelResponse = await axios.post(
        modelServerUrl,
        { filename },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!modelResponse.data.success) {
        return errorResponse(res, 'MODEL_EXTRACTION_FAIL', '모델 서버에서 텍스트 추출 실패', 500);
      }

      markdown = modelResponse.data.text;
      paragraphs = splitMarkdownToParagraphs(markdown);  // PDF일 때도 문단 분리 필요

    } else {
      const ocrResult = await Tesseract.recognize(fileBuffer, 'kor', { logger: () => {} });
      const extractedText = ocrResult.data.text;

      markdown = convertToMarkdown(extractedText);
      paragraphs = splitMarkdownToParagraphs(markdown);
      console.log(paragraphs);  

      console.log('paragraphs:', paragraphs);
      console.log('isArray:', Array.isArray(paragraphs));
      console.log('paragraphs length:', paragraphs.length);
      console.log('paragraphs[0] type:', typeof paragraphs[0]);
    }

    // 3. 요약 API 호출
    const summaryResponse = await axios.post(
      'https://pribuddy.shop/api/summary?data_size=short',
      {
        summaryText: paragraphs,
        checkText: markdown,
      },
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    );

    if (!summaryResponse.data || !summaryResponse.data.success) {
      const errCode = summaryResponse.data?.code || 'SUMMARY_API_FAIL';
      const errMsg = summaryResponse.data?.message || '요약 API 응답 실패';
      return errorResponse(res, errCode, errMsg, 500);
    }

    // 4. 독소조항 탐지 API 호출
    const detectResponse = await axios.post(
      'https://pribuddy.shop/api/unfairDetect?data_size=short',
      {
        detectText: paragraphs,
        checkText: markdown,
      },
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    );

    if (!detectResponse.data || !detectResponse.data.success) {
      const errCode = detectResponse.data?.code || 'UNFAIR_DETECT_FAIL';
      const errMsg = detectResponse.data?.message || '독소조항 탐지 API 응답 실패';
      return errorResponse(res, errCode, errMsg, 500);
    }

    // 5. 결과 통합
    const summaryResults = summaryResponse.data.result || [];
    const detectResults = detectResponse.data.result || [];

    // category별로 detectItems를 병합하는 함수
    const mergedResults = summaryResults.map((summaryCategory) => {
      // detectResults에서 같은 category를 찾는다
      const detectCategory = detectResults.find(
        (detectItem) => detectItem.category === summaryCategory.category
      );

      return {
        category: summaryCategory.category,
        summaryItems: summaryCategory.summaryItems || [],
        detectItems: detectCategory ? detectCategory.detectItems : null,
      };
    });

    // 6. 통합 결과 반환
    return res.status(200).json({
      success: true,
      code: 'SUCCESS',
      message: '모든 요약 및 탐지 결과를 성공적으로 통합했습니다.',
      responseTime: new Date().toISOString(),
      data: {
        documentId: summaryResponse.data.documentId || null,
        results: mergedResults,
      },
    });

  } catch (error) {
    console.error('처리 중 오류:', error);
    return errorResponse(res, 'INTERNAL_SERVER_ERROR', '서버 처리 중 오류가 발생했습니다.', 500);
  }
};

module.exports = analyzeController;
