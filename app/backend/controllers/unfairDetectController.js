const htmlToMarkdown = require('../utils/htmlToMarkdown');
const splitParagraphs = require('../utils/splitParagraphs');
const getTextFromS3 = require('../utils/getTextFromS3'); 
const deleteS3Object = require('../utils/deleteS3Object');
const axios = require('axios');
const DOMPurify = require('isomorphic-dompurify');
const splitMarkdownToParagraphs = require('../utils/splitMarkdownToParagraphs');

const modelServerUrl = process.env.MODEL_SERVER_IP;

// 내부 처리 함수
const detectInternal = async (detectText, data_size) => {
  const documentId = generateDocumentId();
  let paragraphs = [];
  if (data_size === 'long') {
    const bucketName = process.env.S3_BUCKET_NAME_TXT;
    const key = detectText;
    let plainText;

    try {
      plainText = await getTextFromS3(bucketName, key);
      console.log("plainText: ", plainText)
      await deleteS3Object(bucketName, key);
      console.log(`✅ S3에서 파일 삭제 완료: ${key}`);
    } catch (error) {
      throw {
        success: false,
        code: 'S3_FETCH_ERROR',
        message: error.message || 'S3에서 텍스트 파일을 가져오는 중 오류가 발생했습니다.',
        responseTime: new Date().toISOString()
      };
    }

    try {
      const sanitizedHtml = DOMPurify.sanitize(plainText);
      const markdownText = htmlToMarkdown(sanitizedHtml);
      console.log("markdownText: ", markdownText)
      paragraphs = splitParagraphs(markdownText);
    } catch (error) {
      throw {
        success: false,
        code: 'HTML_PROCESSING_ERROR',
        message: error.message || 'HTML 처리 중 오류가 발생했습니다.',
        responseTime: new Date().toISOString()
      };
    }
  } 
  // let paragraphs = [];
  //   const sanitizedHtml = DOMPurify.sanitize(detectText);

  //   if (data_size === 'long') {
  //     try {
  //       const markdownText = htmlToMarkdown(sanitizedHtml);
  //       paragraphs = splitParagraphs(markdownText);
  //     } catch (error) {
  //       return res.status(500).json({
  //         success: false,
  //         code: 'HTML_PROCESSING_ERROR',
  //         message: error.message || 'HTML 처리 중 오류가 발생했습니다.',
  //         responseTime: new Date().toISOString()
  //       });
  //     }
  //   } 

    
  else if (data_size === 'short') {
    paragraphs = splitMarkdownToParagraphs(detectText);
  } else {
    const error = new Error('data_size는 long 또는 short만 가능합니다.');
    error.code = 'INVALID_DATASIZE';
    throw error;
  }

  let modelResponse;
  try {
    modelResponse = await axios.post(
      `http://${modelServerUrl}/llm/unfairDetects`,
      {
        documentId,
        contexts: paragraphs
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("✅ 모델 응답 전체:", JSON.stringify(modelResponse.data, null, 2));
  } catch (error) {
    const statusCode = error.response?.status || 502;
    const errorMsg = error.response?.data?.message || error.message || '모델 서버 요청 실패';
    const wrappedError = new Error(`detect 모델 요청 실패: ${errorMsg}`);
    wrappedError.code = 'MODEL_SERVER_ERROR';
    wrappedError.statusCode = statusCode;
    throw wrappedError;
  }

  const responseData = modelResponse.data?.data;
  if (!responseData || !Array.isArray(responseData.results)) {
    const invalidError = new Error('모델 응답 형식이 잘못되었습니다. (results가 배열이 아님)');
    invalidError.code = 'INVALID_MODEL_RESPONSE';
    invalidError.statusCode = 500;
    throw invalidError;
  }

  const finalResults = responseData.results.map(item => ({
    category: item.category,
    detectedItems: item.detectItems
  }));

  return {
    success: true,
    documentId: responseData.documentId,
    results: finalResults
  };

};

// Express 컨트롤러 함수
const detectController = async (req, res) => {
  try {
    const { data_size } = req.query;
    const { detectText } = req.body;

    if (!detectText || !data_size) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_REQUEST',
        message: 'detectText와 data_size는 필수입니다.',
        responseTime: new Date().toISOString()
      });
    }

    const result = await detectInternal(detectText, data_size);

    return res.status(200).json({
      success: true,
      code: 'SUCCESS',
      message: '모든 탐지 결과를 성공적으로 통합했습니다.',
      responseTime: new Date().toISOString(),
      data: {
        documentId: result.documentId,
        results: result.results
      }
    });

  } catch (error) {
    console.error('❌ detectController Error:', error.message);

    const statusCode = error.statusCode || 500;
    const code = error.code || 'SERVER_ERROR';

    return res.status(statusCode).json({
      success: false,
      code,
      message: error.message || '서버 내부 오류가 발생했습니다.',
      responseTime: new Date().toISOString()
    });
  }
};

const generateDocumentId = () => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `doc-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomStr}`;
};

module.exports = {
  detectController,
  detectInternal
};
