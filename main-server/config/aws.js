const { ECSClient } = require("@aws-sdk/client-ecs");
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const ecsClient = new ECSClient({
  region: process.env.AWS_ECS_REGION,
  credentials,
});

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials,
});

const config = {
  CLUSTER: process.env.ECS_CLUSTER,
  TASK: process.env.ECS_TASK,
  SUBNETS: [
    process.env.ECS_SUBNETS_1,
    process.env.ECS_SUBNETS_2,
    process.env.ECS_SUBNETS_3,
  ],
  SECURITY_GROUPS: [process.env.ECS_SECURITY_GROUPS],
  S3_BUCKET: process.env.AWS_S3_BUCKET_NAME,
};

module.exports = { ecsClient, s3Client, config };
