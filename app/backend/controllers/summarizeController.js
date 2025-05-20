const htmlToMarkdown = require('../utils/htmlToMarkdown');
const splitParagraphs = require('../utils/splitParagraphs');
const axios = require('axios');
const DOMPurify = require('isomorphic-dompurify');

const modelServerUrl = process.env.MODEL_SERVER_IP

const summarizeController = async (req, res) => {
  try {
    const { data_size } = req.query;
    const { summaryText } = req.body;
    
    //checktext 확인하는 부분은 주석처리 됨
    // const { summaryText, checkText } = req.body;

    // if (!summaryText || !checkText || !data_size) {
    //   return res.status(400).json({
    //     success: false,
    //     code: 'INVALID_REQUEST',
    //     message: 'summaryText, checkText, data_size는 필수입니다.',
    //     responseTime: new Date().toISOString()
    //   });
    // }

    const documentId = generateDocumentId();

    // // ✅ 1. checkText 모델 요청
    // try {
    //   const checkTextResponse = await axios.post(
    //     'http://backend-ml:8000/llm/checkText/',
    //     { text: checkText },
    //     { headers: { 'Content-Type': 'application/json' } }
    //   );

    //   if (!checkTextResponse.data.success) {
    //     return res.status(400).json({
    //       success: false,
    //       code: 'CHECK_TEXT_FAILED',
    //       message: 'checkText 모델이 실패 응답을 반환했습니다.',
    //       responseTime: new Date().toISOString()
    //     });
    //   }

    // } catch (error) {
    //   console.error('checkText 모델 요청 실패:', error.message);
    //   return res.status(502).json({
    //     success: false,
    //     code: 'CHECK_TEXT_ERROR',
    //     message: 'checkText 모델 요청 중 오류가 발생했습니다.',
    //     responseTime: new Date().toISOString()
    //   });
    // }

    // ✅ 2. data_size에 따른 HTML 처리
    let paragraphs = [];
    try {
      const sanitizedHtml = DOMPurify.sanitize(summaryText);

      if (data_size === 'long') {
        const markdownText = htmlToMarkdown(sanitizedHtml);
        //console.log('📄 변환된 Markdown:', markdownText);  // ✅ 추가된 로그
        paragraphs = splitParagraphs(markdownText);
        paragraphs.forEach((p, i) => {
        //  console.log(`📄 문단 ${i + 1}:\n${p}\n`);
        });
      } else if (data_size === 'short') {
        paragraphs = [sanitizedHtml];
      } else {
        return res.status(400).json({
          success: false,
          code: 'INVALID_DATASIZE',
          message: 'data_size는 long 또는 short만 가능합니다.',
          responseTime: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('HTML 처리 중 오류 발생:', error.message);
      return res.status(500).json({
        success: false,
        code: 'HTML_PROCESSING_ERROR',
        message: error.message || 'HTML 처리 중 오류가 발생했습니다.',
        responseTime: new Date().toISOString()
      });
    }
    // ✅ 3. summary 모델 요청
    let modelResponse;
    try {
      // console.log('📤 summary 모델에 보낼 요청 데이터:', {
      //   documentId,
      //   contexts: paragraphs
      // }); // ✅ 추가된 로그
      //console.log('contexts 타입 확인:', Array.isArray(paragraphs));  // ✅ true이면 리스트
      
      modelResponse = await axios.post(
        `http://${modelServerUrl}/llm/summaries/`,
        {
          documentId,
          contexts: paragraphs
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('summary 모델 요청 실패:', error.message);
      return res.status(502).json({
        success: false,
        code: 'MODEL_SERVER_ERROR',
        message: 'summary 모델 서버 요청 중 오류가 발생했습니다.',
        responseTime: new Date().toISOString()
      });
    }

    // ✅ 4. 후처리
    const responseData = modelResponse.data?.data;
    if (!responseData || !Array.isArray(responseData.results)) {
      return res.status(500).json({
        success: false,
        code: 'INVALID_MODEL_RESPONSE',
        message: '모델 응답이 올바르지 않습니다.',
        responseTime: new Date().toISOString()
      });
    }

    const finalResults = responseData.results.map(item => ({
      category: item.category,
      summaryItems: item.summaryItems
    }));

    const finalResponse = {
      success: true,
      code: 'SUCCESS',
      message: '모든 요약 결과를 성공적으로 통합했습니다.',
      responseTime: new Date().toISOString(),
      data: {
        documentId: responseData.documentId,
        results: finalResults
      }
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error('summarizeController Error:', error.message);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: error.message,
      responseTime: new Date().toISOString()
    });
  }
};

const generateDocumentId = () => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `doc-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${randomStr}`;
};

module.exports = summarizeController;
