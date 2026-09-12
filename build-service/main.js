const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");
require("dotenv").config();

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const redisUrl = process.env.REDIS_URL;

const publisher = new Redis(redisUrl, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});

publisher.on("connect", () => {
  console.log("[BUILD SERVICE] Connected to Redis publisher");
});

publisher.on("error", (err) => {
  console.error("[BUILD SERVICE] Redis connection error:", err.message);
});

const PROJECT_ID = process.env.PROJECT_ID;

/* ==========================================================================
   LOG FORMATTING & STAGING HELPERS
   ========================================================================== */

function sanitizeLogText(str) {
  if (!str || typeof str !== "string") return str || "";
  return str
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\uE000-\uF8FF]|\uFFFD/g, "")
    .trim();
}

function getStatusFromType(type) {
  switch (type.toLowerCase()) {
    case "error":
      return "ERROR";
    case "stderr":
      return "WARNING";
    case "stdout":
      return "BUILDING";
    default:
      return "INFO";
  }
}

function getStatusBadge(status) {
  const cleanStatus = status ? status.toUpperCase().replace(/[\[\]]/g, "") : "";
  switch (cleanStatus) {
    case "QUEUED":
      return "QUEUED";
    case "STARTED":
      return "STARTED";
    case "BUILDING":
      return "BUILDING";
    case "INFO":
      return "INFO";
    case "WARNING":
    case "WARN":
      return "WARN";
    case "ERROR":
      return "ERROR";
    case "COMPLETED":
    case "SUCCESS":
      return "SUCCESS";
    default:
      return cleanStatus || "INFO";
  }
}

function publishLog(log, type = "info") {
  if (!PROJECT_ID) {
    console.error("[BUILD SERVICE] PROJECT_ID is not defined. Cannot publish logs.");
    return;
  }

  if (!log) return;

  try {
    const rawLines = String(log).split(/\r?\n/);
    const channel = `logs:${PROJECT_ID}`;

    for (const rawLine of rawLines) {
      const sanitizedLine = sanitizeLogText(rawLine);
      if (!sanitizedLine) continue;

      const status = getStatusFromType(type);

      const logData = {
        projectId: PROJECT_ID,
        timestamp: new Date().toISOString(),
        type,
        status,
        statusBadge: getStatusBadge(status),
        message: sanitizedLine,
      };

      console.log(`[${logData.statusBadge}] ${logData.message}`);

      publisher
        .publish(channel, JSON.stringify(logData))
        .catch((error) =>
          console.error(`[BUILD SERVICE] Error publishing log to Redis: ${error.message}`)
        );
    }
  } catch (error) {
    console.error(`[BUILD SERVICE] Error formatting log: ${error.message}`);
  }
}

function formatLogMessage(message) {
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;

    const cleanMsg = sanitizeLogText(parsedMessage.message || "");

    return {
      projectId: parsedMessage.projectId,
      timestamp: new Date().toISOString(),
      formattedTimestamp: new Date(parsedMessage.timestamp || Date.now()).toISOString(),
      type: parsedMessage.type || "info",
      status: parsedMessage.status ? parsedMessage.status.toUpperCase() : "INFO",
      statusBadge: getStatusBadge(parsedMessage.status),
      message: cleanMsg,
    };
  } catch (err) {
    console.error(`[BUILD SERVICE] Error formatting message: ${err.message}`);
    return message;
  }
}

/* ==========================================================================
   EXECUTION CONTROLLER
   ========================================================================== */

async function init() {
  try {
    await waitForRedisConnection(10, 1000);
  } catch (err) {
    console.error("[BUILD SERVICE] Could not connect to Redis:", err.message);
    try {
      publishLog("Failed to establish Redis connection. Build aborted.", "error");
    } catch (e) {}
    process.exit(42);
  }

  publishLog("Build process initialized", "info");

  try {
    const rootDirectory =
      process.env.ROOT_DIRECTORY === "./" ? "" : process.env.ROOT_DIRECTORY || "";

    const outDirPath = path.join(
      __dirname,
      "site",
      ...rootDirectory.split("/").filter(Boolean)
    );
    publishLog(`Project directory: ${outDirPath}`, "info");

    let finalEnvVars = {};
    if (process.env.ENV_VARS && process.env.ENV_VARS.trim() !== "") {
      try {
        const arrayOfObjects = JSON.parse(process.env.ENV_VARS);
        if (Array.isArray(arrayOfObjects)) {
          finalEnvVars = Object.fromEntries(
            arrayOfObjects.map((obj) => [obj.key, obj.value])
          );
          publishLog(`Loaded ${Object.keys(finalEnvVars).length} environment variables`, "info");
        }
      } catch (error) {
        publishLog(`Error parsing ENV_VARS: ${error.message}`, "error");
      }
    }

    if (Object.keys(finalEnvVars).length > 0) {
      try {
        const envFilePath = path.join(outDirPath, ".env");
        const envContent = Object.entries(finalEnvVars)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n");

        fs.mkdirSync(path.dirname(envFilePath), { recursive: true });
        fs.writeFileSync(envFilePath, envContent);
        publishLog(`.env configuration written successfully`, "info");
      } catch (error) {
        publishLog(`Error creating .env file: ${error.message}`, "error");
      }
    }

    const hasPackageJson = fs.existsSync(path.join(outDirPath, "package.json"));

    if (hasPackageJson) {
      publishLog("Package manifest found. Installing dependencies and executing build script...", "info");

      const p = exec(`cd ${outDirPath} && npm install && npm run build`);

      p.stdout.on("data", function (data) {
        publishLog(data.toString(), "stdout");
      });

      p.stderr.on("data", function (data) {
        const errorMessage = data.toString();
        console.error(`[STDERR] ${errorMessage}`);
        publishLog(errorMessage, "stderr");
      });

      p.on("error", function (err) {
        console.error(`[BUILD SERVICE] Process error: ${err.message}`);
        publishLog(`Process error: ${err.message}`, "error");
        publishLog("FAILED", "error");
      });

      try {
        const packageJsonPath = path.join(outDirPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
          const isAngular = Boolean(
            packageJson.dependencies &&
              (packageJson.dependencies["@angular/core"] ||
                packageJson.dependencies["@angular/common"])
          );

          if (isAngular) {
            const projectName = packageJson.name || "";
            publishLog(`Detected Angular project: ${projectName}`, "info");
            process.env.PROJECT_NAME = projectName;
            process.env.IS_ANGULAR = "true";
          } else {
            process.env.IS_ANGULAR = "false";
          }
        }
      } catch (error) {
        console.error(`[BUILD SERVICE] Error reading package.json: ${error.message}`);
        publishLog(`Error reading package.json: ${error.message}`, "stderr");
      }

      await new Promise((resolve, reject) => {
        p.on("close", async function (code) {
          console.log(`[BUILD SERVICE] Build exited with code: ${code}`);
          if (code !== 0) {
            publishLog(`Build failed with exit code ${code}`, "error");
            publishLog("FAILED", "error");
            reject(new Error(`Build failed with exit code ${code}`));
            return;
          }
          publishLog("Build completed successfully", "info");
          resolve();
        });
      });

      const possibleDirs = ["dist", "build"];
      let uploadPath = outDirPath;

      for (const dir of possibleDirs) {
        const checkPath = path.join(outDirPath, dir);
        if (fs.existsSync(checkPath)) {
          uploadPath = checkPath;
          publishLog(`Found build output directory: ${uploadPath}`, "info");
          break;
        }
      }

      await uploadFiles(uploadPath);
    } else {
      publishLog("Static site detected. Uploading files directly...", "info");
      await uploadFiles(outDirPath);
    }
  } catch (error) {
    console.error(`[BUILD SERVICE] Build execution error: ${error.message}`);
    publishLog(`Build execution error: ${error.message}`, "error");
    publishLog("FAILED", "error");

    try {
      await publisher.quit();
    } catch (redisError) {
      console.error(`[BUILD SERVICE] Error disconnecting Redis: ${redisError.message}`);
    }

    process.exit(1);
  }
}

async function uploadFiles(sourcePath) {
  try {
    const files = fs.readdirSync(sourcePath, { recursive: true });
    publishLog(`Preparing to upload ${files.length} files...`, "info");

    for (const file of files) {
      const filePath = path.join(sourcePath, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        continue;
      }

      const relativePath = path.relative(sourcePath, filePath);
      publishLog(`Uploading: ${relativePath}`, "info");

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${PROJECT_ID}/${relativePath}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) || "application/octet-stream",
      });

      await s3Client.send(command);
    }

    publishLog("All build artifacts uploaded successfully", "info");
    publishLog("COMPLETED", "info");

    try {
      await publisher.quit();
      console.log("[BUILD SERVICE] Redis connection closed");
    } catch (error) {
      console.error(`[BUILD SERVICE] Error closing Redis: ${error.message}`);
    }
  } catch (err) {
    console.error(`[BUILD SERVICE] Error uploading build artifacts: ${err.message}`);
    publishLog(`Error uploading files: ${err.message}`, "error");
    publishLog("FAILED", "error");
    throw err;
  }
}

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

module.exports = {
  formatLogMessage,
  getStatusBadge,
};