const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Tesseract = require('tesseract.js');
const path = require('path');
const convertToMarkdown = require('../utils/convertToMarkdown');
const streamToBuffer = require('../utils/streamToBuffer');
const { spawn } = require('child_process');
const { summarizeInternal } = require('./summarizeController');
const { detectInternal } = require('./unfairDetectController');

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

const deleteFileFromS3 = async (key) => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(deleteCommand);
    console.log(`[삭제 완료] ${key}`);
  } catch (err) {
    console.error(`[삭제 실패] ${key}`, err);
  }
};

const analyzeController = async (req, res) => {
  const filesToDelete = [];
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
    filesToDelete.push(currentFile);

    try {
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
      if (mimeToExt[claimedType]) claimedType = mimeToExt[claimedType];

      const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];
      if (!allowedTypes.includes(claimedType)) {
        await deleteFileFromS3(currentFile);
        return errorResponse(res, 'UNSUPPORTED_FILETYPE', `지원하지 않는 파일 형식입니다: ${claimedType}`);
      }

      if (mimeByMagic === 'unknown') {
        await deleteFileFromS3(currentFile);
        return errorResponse(res, 'UNKNOWN_FILETYPE', '파일의 실제 형식을 인식할 수 없습니다.');
      }

      const normalize = (type) => (type === 'jpeg' ? 'jpg' : type);
      if (normalize(claimedType) !== normalize(mimeByMagic)) {
        await deleteFileFromS3(currentFile);
        return errorResponse(res, 'MISMATCH_FILETYPE',
          `파일의 실제 형식(${mimeByMagic})과 요청한 형식(${claimedType})이 일치하지 않습니다.`);
      }

      if (ext && normalize(ext) !== normalize(claimedType)) {
        await deleteFileFromS3(currentFile);
        return errorResponse(res, 'EXTENSION_MISMATCH',
          `파일 확장자(${ext})와 요청한 형식(${claimedType})이 일치하지 않습니다.`);
      }

      if (mimeByMagic === 'pdf') {
        if (filename.length > 1) {
          await deleteFileFromS3(currentFile);
          return errorResponse(res, 'MULTIPLE_PDFS_NOT_ALLOWED', 'PDF 파일은 한 번에 하나만 처리할 수 있습니다.');
        }

        const markdown = await new Promise((resolve, reject) => {
          const pythonProcess = spawn('python3', ['python/parse_pdf.py', process.env.S3_BUCKET_NAME, currentFile]);

          let extractedText = '';
          let errorOutput = '';

          pythonProcess.stdout.on('data', (data) => extractedText += data.toString());
          pythonProcess.stderr.on('data', (data) => errorOutput += data.toString());

          pythonProcess.on('close', async (code) => {
            if (code !== 0) {
              console.error('Error:', errorOutput);
              await deleteFileFromS3(currentFile);
              reject(new Error(`PDF 파싱 실패: ${errorOutput}`));
            } else {
              resolve(extractedText);
            }
          });
        });

        combinedMarkdown = markdown;
        await deleteFileFromS3(currentFile);
        break; // PDF 하나만 처리하므로 루프 종료

      } else {
        const ocrResult = await Tesseract.recognize(fileBuffer, 'kor+eng', { logger: () => {} });
        const extractedText = ocrResult?.data?.text?.trim();
        if (!extractedText) {
          await deleteFileFromS3(currentFile);
          return errorResponse(res, 'OCR_FAIL', `${currentFile}에서 텍스트 추출 실패`, 500);
        }

        const markdown = convertToMarkdown(extractedText);
        if (!markdown || markdown.trim() === '') {
          await deleteFileFromS3(currentFile);
          return errorResponse(res, 'MARKDOWN_CONVERT_FAIL', `${currentFile} 텍스트 변환 결과가 비어있습니다.`, 500);
        }

        combinedMarkdown += '\n\n' + markdown;
        await deleteFileFromS3(currentFile);
      }

    } catch (err) {
      console.error(`[파일 처리 실패] ${currentFile}`, err);
      await deleteFileFromS3(currentFile);
      return errorResponse(res, 'FILE_PROCESS_ERROR', `${currentFile} 처리 중 오류 발생`, 500);
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

    // ✅ 파일 삭제
    for (const key of filesToDelete) {
      await deleteFileFromS3(key);
    }

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
    // ✅ 실패한 경우에도 파일 삭제
    for (const key of filesToDelete) {
      await deleteFileFromS3(key);
    }
    return errorResponse(res, 'SERVER_ERROR', error.message || '서버 오류 발생', 500);
  }
};

module.exports = analyzeController;
