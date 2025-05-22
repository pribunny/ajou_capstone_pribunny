const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 허용된 Content-Type 목록
const allowedContentTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

exports.generatePresignedUrl = async (req, res) => {
  const { filename, contentType } = req.body;

  // 필수 파라미터 누락 검사
  if (!filename || !contentType) {
    return res.status(400).json({
      success: false,
      code: "MISSING_PARAMETERS",
      message: "filename and contentType are required",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }

  // 배열 형식, 길이 제한 검사
  if (
    !Array.isArray(filename) ||
    !Array.isArray(contentType) ||
    filename.length !== contentType.length ||
    filename.length > 5
  ) {
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "filename and contentType must be arrays of the same length, max 5 items",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }

  try {
    // Content-Type 형식 검사 및 필터링
    const filtered = filename
      .map((name, index) => ({
        filename: name,
        contentType: contentType[index],
      }))
      .filter(file => allowedContentTypes.includes(file.contentType));

    if (filtered.length === 0) {
      return res.status(400).json({
        success: false,
        code: "NO_VALID_FILES",
        message: "Only PDF or image files are allowed",
        responseTime: new Date().toISOString(),
        data: null,
      });
    }

    // presigned URL 생성
    const uploadURLs = await Promise.all(
      filtered.map(file => {
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file.filename,
          ContentType: file.contentType,
        });
        return getSignedUrl(s3Client, command, { expiresIn: 60 });
      })
    );

    return res.json({
      success: true,
      code: "SUCCESS",
      message: "Pre-signed URLs generated successfully",
      responseTime: new Date().toISOString(),
      data: {
        uploadURL: uploadURLs,
      },
    });
  } catch (error) {
    console.error("S3 presign error:", error);
    return res.status(500).json({
      success: false,
      code: "S3_PRESIGN_FAILED",
      message: "Failed to generate presigned URLs",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }
};
