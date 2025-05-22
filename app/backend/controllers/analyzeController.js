// // const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
// // const Tesseract = require('tesseract.js');
// // const axios = require('axios');
// // const path = require('path');
// // const https = require('https');
// // const convertToMarkdown = require('../utils/convertToMarkdown');
// // const streamToBuffer = require('../utils/streamToBuffer');
// // const { spawn } = require('child_process');

// // const APIServerUrl = process.env.API_SERVER_IP

// // const s3Client = new S3Client({
// //   region: process.env.AWS_REGION,
// //   credentials: {
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   },
// // });

// // const getMimeTypeByMagic = (buffer) => {
// //   const header = buffer.slice(0, 4).toString('hex').toUpperCase();
// //   if (header.startsWith('25504446')) return 'pdf'; // %PDF
// //   if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpg'; // JPEG
// //   if (header.startsWith('89504E47')) return 'png'; // PNG
// //   return 'unknown';
// // };

// // const errorResponse = (res, code, message, status = 400) => {
// //   return res.status(status).json({
// //     success: false,
// //     code,
// //     message,
// //     responseTime: new Date().toISOString()
// //   });
// // };

// // const analyzeController = async (req, res) => {
// //   try {
// //     const { filename, filetype } = req.body;
    
// //     console.log(`[파일 수신] filename: ${filename}, filetype: ${filetype}`);

// //     if (!filename || !filetype) {
// //       return errorResponse(res, 'MISSING_PARAMS', 'filename과 filetype은 필수입니다.');
// //     }
// //     // 1. S3에서 파일 다운로드
// //     const getCommand = new GetObjectCommand({
// //       Bucket: process.env.S3_BUCKET_NAME,
// //       Key: filename,
// //     });
// //     const s3Response = await s3Client.send(getCommand);
// //     const fileBuffer = await streamToBuffer(s3Response.Body);


// //     // 2. 확장자와 magic number 기반 MIME 검사
// //     const mimeByMagic = getMimeTypeByMagic(fileBuffer);
// //     const ext = path.extname(filename).toLowerCase().replace('.', '');

// //     const mimeToExt = {
// //       'application/pdf': 'pdf',
// //       'image/jpeg': 'jpg',
// //       'image/jpg': 'jpg',
// //       'image/png': 'png',
// //     };

// //     let claimedType = filetype.toLowerCase();
// //     if (mimeToExt[claimedType]) {
// //       claimedType = mimeToExt[claimedType]; // MIME 타입을 확장자로 변환
// //     }

// //     const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];

// //     // 1) 요청된 파일 타입 지원 여부 검사
// //     if (!allowedTypes.includes(claimedType)) {
// //       return errorResponse(res, 'UNSUPPORTED_FILETYPE', `지원하지 않는 파일 형식입니다: ${claimedType}`);
// //     }

// //     // 2) Magic Number 기반 MIME 타입 인식 불가(알 수 없음) 차단
// //     if (mimeByMagic === 'unknown' || !mimeByMagic) {
// //       return errorResponse(res, 'UNKNOWN_FILETYPE', '파일의 실제 형식을 인식할 수 없습니다.');
// //     }

// //     // 3) 요청된 타입과 실제 파일 타입 일치 여부 검사
// //     // jpeg-jpg 간 변환 허용
// //     const normalize = (type) => (type === 'jpeg' ? 'jpg' : type);

// //     if (normalize(claimedType) !== normalize(mimeByMagic)) {
// //       return errorResponse(
// //         res,
// //         'MISMATCH_FILETYPE',
// //         `파일의 실제 형식(${mimeByMagic})과 요청한 형식(${claimedType})이 일치하지 않습니다.`
// //       );
// //     }

// //     // 4) 확장자와 요청된 타입 간 일치 여부 검사 (선택적 강화)
// //     if (ext && normalize(ext) !== normalize(claimedType)) {
// //       return errorResponse(
// //         res,
// //         'EXTENSION_MISMATCH',
// //         `파일 확장자(${ext})와 요청한 형식(${claimedType})이 일치하지 않습니다.`
// //       );
// //     }
// //     let markdown = '';

// //     if (mimeByMagic === 'pdf') {
// //       console.log(`[PDF 인식] ${filename} 파일이 PDF로 인식됨`);

// //       const bucket = process.env.S3_BUCKET_NAME;
// //       const key = filename;
      
// //       console.log("Bucket", bucket);
// //       const pythonProcess = spawn('python3', ['python/parse_pdf.py', bucket, key]);

// //       let extractedText = '';
// //       let errorOutput = '';

// //       pythonProcess.stdout.on('data', data => extractedText += data.toString());
// //       pythonProcess.stderr.on('data', data => errorOutput += data.toString());

// //       pythonProcess.on('close', code => {
// //         if (code !== 0) {
// //           console.error('Error:', errorOutput);
// //           // 에러 처리
// //         } else {
// //           console.log('Markdown:', extractedText);
// //           // 정상 처리
// //         }
// //       });
// //     }
// //     else {
// //       const ocrResult = await Tesseract.recognize(fileBuffer, 'kor+eng', { logger: () => {} });
// //       const extractedText = ocrResult?.data?.text?.trim();
// //       if (!extractedText) {
// //         return errorResponse(res, 'OCR_FAIL', 'OCR에서 텍스트를 추출하지 못했습니다.', 500);
// //       }
// //       markdown = convertToMarkdown(extractedText);
// //         if (!markdown || markdown.trim() === '') {
// //         return errorResponse(res, 'MARKDOWN_CONVERT_FAIL', '텍스트 변환 후 결과가 비어있습니다.', 500);
// //       }
// //     }

// //     // 3. 요약 API 호출
// //     const summaryResponse = await axios.post(
// //       `https://${APIServerUrl}summary?data_size=short`,
// //       {
// //         summaryText: markdown,
// //         checkText: markdown,
// //       },
// //       { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
// //     );

// //     if (!summaryResponse.data || !summaryResponse.data.success) {
// //       const errCode = summaryResponse.data?.code || 'SUMMARY_API_FAIL';
// //       const errMsg = summaryResponse.data?.message || '요약 API 응답 실패';
// //       return errorResponse(res, errCode, errMsg, 500);
// //     }

// //     // 4. 독소조항 탐지 API 호출
// //     const detectResponse = await axios.post(
// //       'https://pribuddy.shop/api/unfairDetect?data_size=short',
// //       {
// //         detectText: markdown,
// //         checkText: markdown,
// //       },
// //       { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
// //     );

// //     if (!detectResponse.data || !detectResponse.data.success) {
// //       const errCode = detectResponse.data?.code || 'UNFAIR_DETECT_FAIL';
// //       const errMsg = detectResponse.data?.message || '독소조항 탐지 API 응답 실패';
// //       return errorResponse(res, errCode, errMsg, 500);
// //     }

// //     // 5. 결과 통합
// //     const summaryResults = summaryResponse.data.data.results;
// //     const detectResults = detectResponse.data.data.results;

// //     // summaryResults와 detectResults를 순서 유지하며 그대로 이어붙음
// //     const mergedResults = [...summaryResults, ...detectResults];

// //     // 6. 통합 결과 반환
// //     return res.status(200).json({
// //       success: true,
// //       code: 'SUCCESS',
// //       message: '모든 요약 및 탐지 결과를 성공적으로 통합했습니다.',
// //       responseTime: new Date().toISOString(),
// //       data: {
// //         documentId: summaryResponse.data.data.documentId,
// //         results: mergedResults,
// //       },
// //     });

// //   } catch (error) {
// //     console.error('처리 중 오류:', error);
// //     return errorResponse(res, 'INTERNAL_SERVER_ERROR', '서버 처리 중 오류가 발생했습니다.', 500);
// //   }
// // };

// // module.exports = analyzeController;


const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const path = require('path');
const https = require('https');
const convertToMarkdown = require('../utils/convertToMarkdown');
const streamToBuffer = require('../utils/streamToBuffer');
const { spawn } = require('child_process');
const { summarizeInternal } = require('./summarizeController');
const { detectInternal } = require('./unfairDetectController')

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

// const analyzeController = async (req, res) => {
//   try {
//     const { filename, filetype } = req.body;
    
//     console.log(`[파일 수신] filename: ${filename}, filetype: ${filetype}`);

//     if (!filename || !filetype) {
//       return errorResponse(res, 'MISSING_PARAMS', 'filename과 filetype은 필수입니다.');
//     }
//     // 1. S3에서 파일 다운로드
//     const getCommand = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: filename,
//     });
//     const s3Response = await s3Client.send(getCommand);
//     const fileBuffer = await streamToBuffer(s3Response.Body);


//     // 2. 확장자와 magic number 기반 MIME 검사
//     const mimeByMagic = getMimeTypeByMagic(fileBuffer);
//     const ext = path.extname(filename).toLowerCase().replace('.', '');

//     const mimeToExt = {
//       'application/pdf': 'pdf',
//       'image/jpeg': 'jpg',
//       'image/jpg': 'jpg',
//       'image/png': 'png',
//     };

//     let claimedType = filetype.toLowerCase();
//     if (mimeToExt[claimedType]) {
//       claimedType = mimeToExt[claimedType]; // MIME 타입을 확장자로 변환
//     }

//     const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];

//     // 1) 요청된 파일 타입 지원 여부 검사
//     if (!allowedTypes.includes(claimedType)) {
//       return errorResponse(res, 'UNSUPPORTED_FILETYPE', `지원하지 않는 파일 형식입니다: ${claimedType}`);
//     }

//     // 2) Magic Number 기반 MIME 타입 인식 불가(알 수 없음) 차단
//     if (mimeByMagic === 'unknown' || !mimeByMagic) {
//       return errorResponse(res, 'UNKNOWN_FILETYPE', '파일의 실제 형식을 인식할 수 없습니다.');
//     }

//     // 3) 요청된 타입과 실제 파일 타입 일치 여부 검사
//     // jpeg-jpg 간 변환 허용
//     const normalize = (type) => (type === 'jpeg' ? 'jpg' : type);

//     if (normalize(claimedType) !== normalize(mimeByMagic)) {
//       return errorResponse(
//         res,
//         'MISMATCH_FILETYPE',
//         `파일의 실제 형식(${mimeByMagic})과 요청한 형식(${claimedType})이 일치하지 않습니다.`
//       );
//     }

//     // 4) 확장자와 요청된 타입 간 일치 여부 검사 (선택적 강화)
//     if (ext && normalize(ext) !== normalize(claimedType)) {
//       return errorResponse(
//         res,
//         'EXTENSION_MISMATCH',
//         `파일 확장자(${ext})와 요청한 형식(${claimedType})이 일치하지 않습니다.`
//       );
//     }
    
//     if (mimeByMagic === 'pdf') {
//       console.log(`[PDF 인식] ${filename} 파일이 PDF로 인식됨`);

//       const bucket = process.env.S3_BUCKET_NAME;
//       const key = filename;

//       markdown = await new Promise((resolve, reject) => {
//         const pythonProcess = spawn('python3', ['python/parse_pdf.py', bucket, key]);

//         let extractedText = '';
//         let errorOutput = '';

//         pythonProcess.stdout.on('data', (data) => extractedText += data.toString());
//         pythonProcess.stderr.on('data', (data) => errorOutput += data.toString());

//         pythonProcess.on('close', (code) => {
//           if (code !== 0) {
//             console.error('Error:', errorOutput);
//             reject(new Error(`PDF 파싱 실패: ${errorOutput}`));
//           } else {
//             console.log('Markdown:', extractedText);
//             resolve(extractedText);
//           }
//         });
//       });
//     }
//     else {
//       const ocrResult = await Tesseract.recognize(fileBuffer, 'kor+eng', { logger: () => {} });
//       const extractedText = ocrResult?.data?.text?.trim();
//       if (!extractedText) {
//         return errorResponse(res, 'OCR_FAIL', 'OCR에서 텍스트를 추출하지 못했습니다.', 500);
//       }
//       markdown = convertToMarkdown(extractedText);
//         if (!markdown || markdown.trim() === '') {
//         return errorResponse(res, 'MARKDOWN_CONVERT_FAIL', '텍스트 변환 후 결과가 비어있습니다.', 500);
//       }
//     }

//     const summaryResult = await summarizeInternal(markdown, 'short');
//     if (!summaryResult.success) {
//       return errorResponse(res, 'SUMMARY_FAIL', '요약 실패', 500);
//     }

//     const detectResult = await detectInternal(markdown, 'short');
//     if (!detectResult.success) {
//       return errorResponse(res, 'UNFAIRDETECT_FAIL', '탐지 실패', 500);
//     }

//     // summaryResult와 detectResult의 results 배열을 순서 유지하며 이어붙임
//     const mergedResults = [...summaryResult.results, ...detectResult.results];

//     // 통합 결과 반환
//     return res.status(200).json({
//       success: true,
//       code: 'SUCCESS',
//       message: '모든 요약 및 탐지 결과를 성공적으로 통합했습니다.',
//       responseTime: new Date().toISOString(),
//       data: {
//         documentId: summaryResult.documentId,
//         results: mergedResults,
//       },
//     });

//   } catch (error) {
//     console.error('analyzeController error:', error);
//     return errorResponse(res, 'SERVER_ERROR', error.message || '서버 오류 발생', 500);
//   }
// };

// module.exports = analyzeController;

const analyzeController = async (req, res) => {
  try {
    const { filename, filetype } = req.body;

    if (!filename || !filetype || !Array.isArray(filename) || !Array.isArray(filetype)) {
      return errorResponse(res, 'INVALID_PARAMS', 'filename과 filetype은 배열 형식으로 필수입니다.');
    }

    if (filename.length > 5 || filetype.length > 5) {
      return errorResponse(res, 'TOO_MANY_FILES', '파일은 최대 5개까지 허용됩니다.');
    }

    let combinedMarkdown = '';

    for (let i = 0; i < filename.length; i++) {
      const currentFile = filename[i];
      const currentType = filetype[i];

      console.log(`[파일 수신] filename: ${currentFile}, filetype: ${currentType}`);

      const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: currentFile,
      });
      const s3Response = await s3Client.send(getCommand);
      const fileBuffer = await streamToBuffer(s3Response.Body);

      const mimeByMagic = getMimeTypeByMagic(fileBuffer);
      const ext = path.extname(currentFile).toLowerCase().replace('.', '');

      const mimeToExt = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
      };

      let claimedType = currentType.toLowerCase();
      if (mimeToExt[claimedType]) {
        claimedType = mimeToExt[claimedType];
      }

      const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
      if (!allowedTypes.includes(claimedType)) {
        return errorResponse(res, 'UNSUPPORTED_FILETYPE', `지원하지 않는 파일 형식입니다: ${claimedType}`);
      }

      if (mimeByMagic === 'unknown') {
        return errorResponse(res, 'UNKNOWN_FILETYPE', '파일의 실제 형식을 인식할 수 없습니다.');
      }

      const normalize = (type) => (type === 'jpeg' ? 'jpg' : type);
      if (normalize(claimedType) !== normalize(mimeByMagic)) {
        return errorResponse(
          res,
          'MISMATCH_FILETYPE',
          `파일의 실제 형식(${mimeByMagic})과 요청한 형식(${claimedType})이 일치하지 않습니다.`
        );
      }

      if (ext && normalize(ext) !== normalize(claimedType)) {
        return errorResponse(
          res,
          'EXTENSION_MISMATCH',
          `파일 확장자(${ext})와 요청한 형식(${claimedType})이 일치하지 않습니다.`
        );
      }

      if (mimeByMagic === 'pdf') {
        if (filename.length > 1) {
          return errorResponse(res, 'MULTIPLE_PDFS_NOT_ALLOWED', 'PDF 파일은 한 번에 하나만 처리할 수 있습니다.');
        }

        const markdown = await new Promise((resolve, reject) => {
          const pythonProcess = spawn('python3', ['python/parse_pdf.py', process.env.S3_BUCKET_NAME, currentFile]);

          let extractedText = '';
          let errorOutput = '';

          pythonProcess.stdout.on('data', (data) => extractedText += data.toString());
          pythonProcess.stderr.on('data', (data) => errorOutput += data.toString());

          pythonProcess.on('close', (code) => {
            if (code !== 0) {
              console.error('Error:', errorOutput);
              reject(new Error(`PDF 파싱 실패: ${errorOutput}`));
            } else {
              console.log('Markdown:', extractedText);
              resolve(extractedText);
            }
          });
        });

        combinedMarkdown = markdown;
        break; // PDF는 하나만 처리하므로 루프 종료

      } else {
        const ocrResult = await Tesseract.recognize(fileBuffer, 'kor+eng', { logger: () => {} });
        const extractedText = ocrResult?.data?.text?.trim();
        if (!extractedText) {
          return errorResponse(res, 'OCR_FAIL', `${currentFile}에서 텍스트 추출 실패`, 500);
        }

        const markdown = convertToMarkdown(extractedText);
        if (!markdown || markdown.trim() === '') {
          return errorResponse(res, 'MARKDOWN_CONVERT_FAIL', `${currentFile} 텍스트 변환 후 결과가 비어있습니다.`, 500);
        }

        combinedMarkdown += '\n\n' + markdown;
      }
    }

    const summaryResult = await summarizeInternal(combinedMarkdown, 'short');
    if (!summaryResult.success) {
      return errorResponse(res, 'SUMMARY_FAIL', '요약 실패', 500);
    }

    const detectResult = await detectInternal(combinedMarkdown, 'short');
    if (!detectResult.success) {
      return errorResponse(res, 'UNFAIRDETECT_FAIL', '탐지 실패', 500);
    }

    console.log("요약 결과: ", summaryResult.results);
    console.log("탐지 결과: ", detectResult.results);

    const mergedResults = [...summaryResult.results, ...detectResult.results];

    return res.status(200).json({
      success: true,
      code: 'SUCCESS',
      message: '모든 요약 및 탐지 결과를 성공적으로 통합했습니다.',
      responseTime: new Date().toISOString(),
      data: {
        documentId: summaryResult.documentId,
        results: mergedResults,
      },
    });

  } catch (error) {
    console.error('analyzeController error:', error);
    return errorResponse(res, 'SERVER_ERROR', error.message || '서버 오류 발생', 500);
  }
};

module.exports = analyzeController