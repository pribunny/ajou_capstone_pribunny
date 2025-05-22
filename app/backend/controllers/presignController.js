const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const path = require("path");
const crypto = require("crypto");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const allowedContentTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

exports.generatePresignedUrl = async (req, res) => {
  const { filename, contentType } = req.body;

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
    const filtered = filename
      .map((_, index) => ({
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

    const results = await Promise.all(
      filtered.map(async (file) => {
        const ext = file.contentType.includes('pdf') ? '.pdf' :
                    file.contentType.includes('png') ? '.png' :
                    '.jpg'; // default fallback
        const randomKey = `${crypto.randomUUID()}${ext}`;
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: randomKey,
          ContentType: file.contentType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        return {
          key: randomKey,
          uploadURL: url,
        };
      })
    );

    // ✅ 원하는 형태로 변환
    const response = {
      key: results.map(r => r.key),
      uploadURL: results.map(r => r.uploadURL),
    };

    return res.json(response);

  } catch (error) {
    console.error("S3 presign error:", error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate presigned URLs",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }
};
