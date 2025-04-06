const { ECSClient } = require("@aws-sdk/client-ecs");
require("dotenv").config();

const ecsClient = new ECSClient({
  region: process.env.AWS_ECS_REGION, // Based on ARN in env file
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
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
};

module.exports = { ecsClient, config };
