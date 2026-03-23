// utils/deleteS3Object.js
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// S3Client 인스턴스 생성
const s3Client = new S3Client({ region: process.env.AWS_REGION });

const deleteS3Object = async (bucketName, key) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  await s3Client.send(command);
};

module.exports = deleteS3Object;
