const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

// Setting up Redis client for publishing logs
// Publishes detailed logs to Redis for monitoring.
const redisUrl = process.env.REDIS_URL;

const publisher = new Redis(redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

publisher.on("connect", () => {
  console.log("✅ Successfully connected to Redis");
});

publisher.on("error", (err) => {
  console.error("❗ Redis connection error:", err);
});

// This will be the folder name in the S3 bucket or the domain name of the site.
const PROJECT_ID = process.env.PROJECT_ID;

// Function to publish logs to Redis
function publishLog(log, type = "info") {
  if (!PROJECT_ID) {
    console.error("PROJECT_ID is not defined. Cannot publish logs to Redis.");
    return;
  }

  try {
    const logData = {
      projectId: PROJECT_ID,
      timestamp: new Date().toISOString(),
      type,
      status: getStatusFromType(type),
      message: formatMessage(log, type),
      details: getDetailsFromLog(log, type),
      stage: getStageFromLog(log, type),
      stageBadge: getStageBadge(log, type),
      statusBadge: getStatusBadge(log, type),
    };

    // Console log the same data that's being published to Redis
    console.log(`📋 LOG: [${logData.status}] ${logData.message}`);
    if (logData.details && logData.details !== log) {
      console.log(`   Details: ${logData.details}`);
    }
    console.log(`   Stage: ${logData.stage}`);
    console.log(`   Full log data: ${JSON.stringify(logData)}`);

    const channel = `logs:${PROJECT_ID}`;
    publisher
      .publish(channel, JSON.stringify(logData))
      .catch((error) =>
        console.error(`🚨 Error publishing to Redis: ${error.message}`)
      );
  } catch (error) {
    console.error(`🚨 Error formatting log for Redis: ${error.message}`);
  }
}

// Helper functions for formatting messages
function getStatusFromType(type) {
  switch (type) {
    case "error":
      return "ERROR";
    case "stderr":
      return "WARNING";
    case "stdout":
      return "BUILDING";
    case "info":
    default:
      return "INFO";
  }
}

function formatMessage(log, type) {
  const emoji = getEmojiForType(type);

  if (type === "error") {
    return `${emoji} Build error: ${log.substring(0, 100)}${
      log.length > 100 ? "..." : ""
    }`;
  } else if (log.includes("uploaded successfully")) {
    return "🎉 Deployment completed successfully!";
  } else if (log.includes("Installing dependencies")) {
    return "🔧 Setting up your project dependencies...";
  } else if (log.includes("Starting build process")) {
    return "🚀 Initiating build process for your project";
  } else if (log.includes("Uploading file:")) {
    const fileName = log.split("Uploading file:").pop().trim();
    return `📤 Uploading: ${path.basename(fileName)}`;
  } else if (log.includes("Found build directory")) {
    return "📁 Build output directory located successfully";
  }

  return `${emoji} ${log}`;
}

function getEmojiForType(type) {
  switch (type) {
    case "error":
      return "❌";
    case "stderr":
      return "⚠️";
    case "stdout":
      return "🔄";
    case "info":
    default:
      return "ℹ️";
  }
}

function getDetailsFromLog(log, type) {
  if (type === "error") {
    return `Error details: ${log}`;
  } else if (log.includes("Total files found:")) {
    return `Preparing to upload all build artifacts to deployment server`;
  } else if (log.includes("Installing dependencies")) {
    return "This may take a few minutes depending on project size";
  }
  return log;
}

function getStageFromLog(log, type) {
  if (type === "error") {
    return "failed";
  } else if (log.includes("Starting build process")) {
    return "initialization";
  } else if (log.includes("Installing dependencies")) {
    return "setup";
  } else if (log.includes("Build completed successfully")) {
    return "built";
  } else if (log.includes("Starting to upload")) {
    return "uploading";
  } else if (log.includes("uploaded successfully")) {
    return "completed";
  }
  return "building";
}

function getStageBadge(log, type) {
  const stage = getStageFromLog(log, type);
  switch (stage) {
    case "initialization":
      return "🔰 Init";
    case "setup":
      return "📦 Setup";
    case "building":
      return "🏗️ Build";
    case "built":
      return "⚙️ Built";
    case "uploading":
      return "🚀 Deploy";
    case "completed":
      return "✨ Success";
    case "failed":
      return "💔 Failed";
    default:
      return `🔹 ${stage.charAt(0).toUpperCase() + stage.slice(1)}`;
  }
}

function getStatusBadge(log, type) {
  if (type === "error") {
    return "❌ Error";
  } else if (type === "stderr") {
    return "⚠️ Warning";
  } else if (log.includes("uploaded successfully")) {
    return "✅ Success";
  } else if (log.includes("Build completed successfully")) {
    return "✅ Success";
  } else if (log.includes("Installing dependencies")) {
    return "🔄 In Progress";
  } else if (log.includes("Starting build process")) {
    return "🚀 Started";
  } else if (log.includes("Uploading file:")) {
    return "📤 Uploading";
  }
  return `ℹ️ ${getStatusFromType(type)}`;
}

async function init() {
  try {
    await waitForRedisConnection(10, 1000);
  } catch (err) {
    console.error("❗ Could not connect to Redis:", err.message);
    // Try to publish error log if possible
    try {
      publishLog("Could not connect to Redis. Could not deploy your project.", "error");
    } catch (e) {}
    // Exit with a specific code so ECS knows this is a fatal error
    process.exit(42);
  }

  publishLog("Starting build process");

  try {
    // selecting root directing which is coming from frontend i.e. /frontend or /backend
    const rootDirectory =
      process.env.ROOT_DIRECTORY === "./" ? "" : process.env.ROOT_DIRECTORY;

    // from outDir we will upload files in the s3 bucket.

    const outDirPath = path.join(
      __dirname,
      "site",
      ...rootDirectory.split("/")
    );
    publishLog(`Project directory: ${outDirPath}`);

    // Manually parsing json object without using JSON.parse function.
    let finalEnvVars = {};

    try {
      // Check if ENV_VARS is provided and is not empty
      if (process.env.ENV_VARS && process.env.ENV_VARS.trim() !== "") {
        const arrayOfObjects = JSON.parse(process.env.ENV_VARS);

        // Process each key-value pair
        arrayOfObjects.forEach((obj) => {
          finalEnvVars[obj.key] = obj.value;
        });
      } else {
        publishLog(`No env variables provided.`);
      }
    } catch (error) {
      publishLog(`Error parsing ENV_VARS: ${error.message}`, "error");
    }

    // Create .env file in the project directory
    if (Object.keys(finalEnvVars).length > 0) {
      try {
        // Making the path for env file in the folder(folder1/folder2/folder3) in which build command will be run and then files will be uploaded to s3.
        const envFilePath = path.join(outDirPath, ".env");

        publishLog("FOUND ENV FILE");

        // Extracting env content.
        const envContent = Object.entries(finalEnvVars)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n");

        // Writing extracted content into the env file.
        fs.mkdirSync(path.dirname(envFilePath), { recursive: true });
        fs.writeFileSync(envFilePath, envContent);
        publishLog(
          `.env file created with ${
            Object.keys(finalEnvVars).length
          } variables.`
        );
      } catch (error) {
        publishLog(
          `Error creating or uploading .env file: ${error.message}`,
          "error"
        );
        // Don't throw here - continue with the build process
      }
    }

    // Check if package.json exists (Identifying if its a simple or framework project)
    const hasPackageJson = fs.existsSync(path.join(outDirPath, "package.json"));

    if (hasPackageJson) {
      // Run build process for projects with package.json
      publishLog("package.json found. Running build process...");

      const p = exec(`cd ${outDirPath} && npm install && npm run build`);

      p.stdout.on("data", function (data) {
        const logMessage = data.toString();
        publishLog(logMessage, "stdout");
      });

      p.stderr.on("data", function (data) {
        const errorMessage = data.toString();
        console.error(`🚨 STDERR: ${errorMessage}`);
        publishLog(errorMessage, "stderr");
      });

      p.on("error", function (err) {
        console.error(`🚨 Error occurred: ${err.message}`);
        publishLog(`Error occurred: ${err.message}`, "error");
        publishLog("FAILED", "error");
      });

      // Read package.json to detect if it's an Angular project
      try {
        const packageJsonPath = path.join(outDirPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
          );

          // Check if it's an Angular project by looking for Angular dependencies
          const isAngular =
            packageJson.dependencies &&
            (packageJson.dependencies["@angular/core"] ||
              packageJson.dependencies["@angular/common"]);

          if (isAngular) {
            const projectName = packageJson.name || "";
            publishLog(`Detected Angular project: ${projectName}`, "info");
            // Include Angular-specific details in the logs
            publishLog(
              `Angular project details: {"name":"${projectName}","isAngular":true}`,
              "info"
            );

            // Store project name for reference in upload path determination
            process.env.PROJECT_NAME = projectName;
            process.env.IS_ANGULAR = "true";
            publishLog(`Project name extracted: ${projectName}`, "info");
          } else {
            publishLog("Not an Angular project", "info");
            process.env.IS_ANGULAR = "false";
          }
        }
      } catch (error) {
        console.error(`🚨 Error reading package.json: ${error.message}`);
        publishLog(`Error reading package.json: ${error.message}`, "stderr");
      }

      await new Promise((resolve, reject) => {
        p.on("close", async function (code) {
          console.log(`Build process exited with code: ${code}`);
          if (code !== 0) {
            console.error(`🚨 Build process exited with code: ${code}`);
            publishLog(`Build process exited with code: ${code}`, "error");
            publishLog("FAILED", "error");
            reject(new Error(`Build failed with code ${code}`));
            return;
          }
          console.log("🎉 Build completed successfully!");
          publishLog("Build completed successfully!");
          resolve();
        });
      });

      // Look for build output in dist or build directory
      const possibleDirs = ["dist", "build"];
      let uploadPath = outDirPath;

      for (const dir of possibleDirs) {
        const checkPath = path.join(outDirPath, dir);
        if (fs.existsSync(checkPath)) {
          uploadPath = checkPath;
          publishLog(`Found build directory: ${uploadPath}`);
          break;
        }
      }

      await uploadFiles(uploadPath);
    } else {
      // Handle static website (no package.json)
      publishLog("Static website detected. Proceeding with direct upload...");
      await uploadFiles(outDirPath);
    }
  } catch (error) {
    console.error(`🚨 Error in build/upload process: ${error.message}`);
    publishLog(`Error in build/upload process: ${error.message}`, "error");
    publishLog("FAILED", "error");

    // Close Redis connection on error
    try {
      await publisher.quit();
    } catch (redisError) {
      console.error(`❗ Error closing Redis connection: ${redisError.message}`);
    }

    process.exit(1); // Exit with error code
  }
}

async function uploadFiles(sourcePath) {
  try {
    const files = fs.readdirSync(sourcePath, { recursive: true });
    publishLog(`Total files found: ${files.length}`);

    for (const file of files) {
      const filePath = path.join(sourcePath, file);

      // Skip if it's a directory
      if (fs.lstatSync(filePath).isDirectory()) {
        publishLog(`Skipping directory: ${file}`);
        continue;
      }

      // Get the relative path for S3 key
      const relativePath = path.relative(sourcePath, filePath);
      publishLog(`Uploading file: ${relativePath}`);

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${PROJECT_ID}/${relativePath}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      });

      await s3Client.send(command);
      publishLog(`Uploaded: ${relativePath}`);
    }

    console.log("🎉 All files uploaded successfully!");
    publishLog("All files uploaded successfully!");
    publishLog("COMPLETED", "info");

    // Close Redis connection
    try {
      console.log("📡 Closing Redis connection...");
      await publisher.quit();
      console.log("✅ Redis connection closed successfully");
    } catch (error) {
      console.error(`❗ Error closing Redis connection: ${error.message}`);
    }
  } catch (err) {
    console.error(`🚨 Error while reading or uploading files: ${err.message}`);
    publishLog(
      `Error while reading or uploading files: ${err.message}`,
      "error"
    );
    publishLog("FAILED", "error");
    throw err;
  }
}

process.on("SIGINT", async () => {
  console.log("👋 Received SIGINT. Closing Redis connection...");
  try {
    await publisher.quit();
    console.log("✅ Redis connection closed successfully");
  } catch (error) {
    console.error(`❗ Error closing Redis connection: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
  }
  process.exit(0);
});

async function waitForRedisConnection(maxRetries = 10, retryDelay = 1000) {
  let retries = 0;
  return new Promise((resolve, reject) => {
    if (publisher.status === "ready") return resolve();
    const onConnect = () => {
      publisher.off("error", onError);
      resolve();
    };
    const onError = (err) => {
      retries++;
      if (retries >= maxRetries) {
        publisher.off("connect", onConnect);
        reject(new Error("Could not connect to Redis after max retries"));
      } else {
        setTimeout(() => {
          if (publisher.status === "ready") {
            publisher.off("error", onError);
            resolve();
          }
        }, retryDelay);
      }
    };
    publisher.once("connect", onConnect);
    publisher.on("error", onError);
  });
}

init();
