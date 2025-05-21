const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.generatePresignedUrl = async (req, res) => {
  const { filename, contentType } = req.body;

  if (!filename || !contentType) {
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "filename and contentType are required",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    ContentType: contentType,
  });

  try {
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    console.log("Generated presigned URL:", uploadURL);

    return res.json({
      success: true,
      code: "SUCCESS",
      message: "Pre-signed URL generated successfully",
      responseTime: new Date().toISOString(),
      data: { uploadURL },
    });
  } catch (error) {
    console.error("S3 presign error:", error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate presigned URL",
      responseTime: new Date().toISOString(),
      data: null,
    });
  }
};
