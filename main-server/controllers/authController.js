const axios = require("axios");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Validate required environment variables
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing required GitHub OAuth environment variables");
}

const githubCallback = async (req, res) => {
  console.log("======================== HIT CALL BACK====================");
  const code = req.query.code;

  console.log("=============code===========", code);

  if (!code)
    return res.status(400).json({ error: "Authorization code missing" });

  try {
    const tokenResponse = await axios.post(
      process.env.GITHUB_ACCESS_TOKEN_ENDPOINT,
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        },
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    console.log("=============accessToken===========", accessToken);

    if (!accessToken)
      return res.status(400).json({ error: "Failed to get access token" });

    res.cookie("github_token", accessToken, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Error authenticating with GitHub:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  githubCallback,
};
