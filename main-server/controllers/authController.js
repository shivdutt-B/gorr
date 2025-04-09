const axios = require("axios");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";


// Validate required environment variables
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing required GitHub OAuth environment variables");
}

const githubCallback = async (req, res) => {
  const code = req.query.code;

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

    if (!accessToken)
      return res.status(400).json({ error: "Failed to get access token" });

    res.cookie("github_token", accessToken, {
      httpOnly: true,
      sameSite: "lax", // or "strict" if frontend and backend share domain
      secure: false, // only use secure: true in production over HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    // res.redirect(`${FRONTEND_URL}/dashboard?token=${accessToken}`);
    // Redirect to dashboard without any query parameters
    // The token is already stored in an HTTP-only cookie that the frontend can verify
    console.log("frontend url", FRONTEND_URL);
    res.redirect(`${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error("Error authenticating with GitHub:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  githubCallback,
};
