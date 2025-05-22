const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const allowedContentTypes = ["text/plain"];
const allowedExtensions = ["txt"];

exports.generatePresignedUrl = async (req, res) => {
  const { filename, contentType } = req.body;

  if (typeof filename !== "string" || typeof contentType !== "string") {
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "`filename` and `contentType` must be strings",
      responseTime: new Date().toISOString(),
    });
  }

  const ext = filename.split(".").pop().toLowerCase();

  if (!allowedContentTypes.includes(contentType) || !allowedExtensions.includes(ext)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_FILE_TYPE",
      message: "Only .txt files are allowed",
      responseTime: new Date().toISOString(),
    });
  }

  try {
    const key = `${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME_TXT,
      Key: key,
      ContentType: contentType,
    });

    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return res.json({
      success: true,
      code: "SUCCESS",
      message: "Pre-signed URL generated successfully",
      responseTime: new Date().toISOString(),
      data: {
        key,
        uploadURL,
      },
    });
  } catch (error) {
    console.error("S3 presign error:", error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate presigned URL",
      responseTime: new Date().toISOString(),
    });
  }
};
