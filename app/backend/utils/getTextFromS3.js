const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const streamToBuffer = require('./streamToBuffer');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const getTextFromS3 = async (bucketName, key) => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const response = await s3.send(command);

  const buffer = await streamToBuffer(response.Body);
  return buffer.toString('utf-8');
};

module.exports = getTextFromS3;
