const axios = require("axios");

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL = "http://localhost:5174",
  GITHUB_ACCESS_TOKEN_ENDPOINT = "https://github.com/login/oauth/access_token",
} = process.env;

/**
 * Handles GitHub OAuth authorization code exchange and redirects back to frontend dashboard with token.
 */
const githubCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const { data } = await axios.post(
      GITHUB_ACCESS_TOKEN_ENDPOINT,
      null,
      {
        params: {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        headers: { Accept: "application/json" },
      }
    );

    if (!data.access_token) {
      return res.status(400).json({ error: "Failed to get access token" });
    }

    return res.redirect(`${FRONTEND_URL}/dashboard?token=${data.access_token}`);
  } catch (error) {
    console.error("❌ Error authenticating with GitHub:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  githubCallback,
};
