const htmlToMarkdown = require('../utils/htmlToMarkdown');
const splitParagraphs = require('../utils/splitParagraphs');
const axios = require('axios');

const summarizeController = async (req, res) => {
  try {
    const { data_size } = req.query;
    const { summaryText } = req.body;
    
    if (!summaryText || !data_size) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_REQUEST',
        message: 'summaryText와 data_size는 필수입니다.'
      });
    }

    console.log('✅ 원본 summaryText (HTML):\n', summaryText);

    const documentId = generateDocumentId(); // 랜덤 ID 생성 

    // 1. HTML -> Markdown 변환
    let markdownText;
    try {
      markdownText = htmlToMarkdown(summaryText);
      console.log('✅ 변환된 Markdown:\n', markdownText);
    } catch (error) {
      console.error('HTML -> Markdown 변환 중 오류 발생:', error);
      return res.status(500).json({
        success: false,
        code: 'HTML_TO_MARKDOWN_ERROR',
        message: 'HTML -> Markdown 변환 중 오류가 발생했습니다.'
      });
    }

    // 2. data_size가 'long'일 때만 문단 분리 수행
    let paragraphs = [];
    try {
      if (data_size === 'long') {
        paragraphs = splitParagraphs(markdownText);
      } else if (data_size === 'short') {
        paragraphs = [markdownText];
      } else {
        return res.status(400).json({
          success: false,
          code: 'INVALID_DATASIZE',
          message: 'data_size는 long 또는 short만 가능합니다.'
        });
      }
    } catch (error) {
      console.error('문단 분리 중 오류 발생:', error);
      return res.status(500).json({
        success: false,
        code: 'PARAGRAPH_SPLIT_ERROR',
        message: '문단 분리 중 오류가 발생했습니다.'
      });
    }
    
    const requestBody = {
      documentId: documentId,
      contexts: paragraphs
    };

    // ✅ 모델 서버에 보낼 데이터 로그 출력
    console.log('✅ [모델 요청 데이터]');
    console.log(`- documentId: ${requestBody.documentId}`);
    console.log(`- paragraphs 개수: ${requestBody.contexts.length}`);
    console.log('- paragraphs 내용:');
    requestBody.contexts.forEach((para, idx) => {
      console.log(`  [${idx + 1}] ${para}`);
    });
    
    const apiUrl = `http://backend-ml:8000/llm/summaries/`;

    const modelResponse = await axios.post(apiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    // 응답을 통합하는 함수
    function buildSummaryResponse(modelResponse) {
      if (!modelResponse.success) {
        throw new Error('요약 실패: ' + (modelResponse.message || 'Unknown Error'));
      }

      const { documentId, results } = modelResponse.data;

      const summaryItems = results.flatMap(result => result.summaryItems);

      return {
        success: true,
        code: "SUCCESS",
        message: "모든 요약 결과를 성공적으로 통합했습니다.",
        responseTime: new Date().toISOString(),  // 현재 시간
        data: {
          documentId: documentId,
          summaryItems: summaryItems
        }
      };
    }

    // 모델 응답을 통합
    const finalResponse = buildSummaryResponse(modelResponse.data);

    // 최종 응답 반환
    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error('summarizeController Error:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: error.message
    });
  }
};

// 랜덤 Document ID 생성 함수 (ex: 'doc-20240512-abcdef')
const generateDocumentId = () => {
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `doc-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${randomStr}`;
};

module.exports = summarizeController;
