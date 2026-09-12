const axios = require("axios");
const { prisma } = require("../services/prismaService");

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL = "http://localhost:5174",
  GITHUB_ACCESS_TOKEN_ENDPOINT = "https://github.com/login/oauth/access_token",
} = process.env;

/**
 * Handles GitHub OAuth callback code exchange, user creation/lookup,
 * session establishment, and cookie issuance.
 */
const githubCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ status: "error", message: "Authorization code missing" });
  }

  try {
    // 1. Exchange OAuth code for GitHub access token
    const tokenResponse = await axios.post(
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

    const accessToken = tokenResponse.data?.access_token;
    if (!accessToken) {
      return res.status(400).json({ status: "error", message: "Failed to obtain access token from GitHub" });
    }

    // 2. Fetch GitHub user profile to obtain GitHub numeric user ID and safe public profile details
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "GORR-App",
      },
    });

    const githubUserId = userResponse.data?.id;
    if (!githubUserId) {
      return res.status(400).json({ status: "error", message: "Failed to retrieve user profile from GitHub" });
    }

    // 3. Find or create user in database
    const user = await prisma.user.upsert({
      where: { userId: githubUserId },
      create: { userId: githubUserId },
      update: {},
    });

    // 4. Regenerate session to protect against session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error("❌ Session regeneration error:", err);
        return res.status(500).json({ status: "error", message: "Internal server error" });
      }

      // Store application user identity and safe display metadata in server-side session
      req.session.userId = user.userId;
      req.session.id = user.id;
      req.session.login = userResponse.data.login;
      req.session.name = userResponse.data.name;
      req.session.avatar_url = userResponse.data.avatar_url;
      req.session.repos_url = userResponse.data.repos_url;

      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("❌ Session save error:", saveErr);
          return res.status(500).json({ status: "error", message: "Internal server error" });
        }

        // Redirect browser to dashboard without exposing tokens or user IDs in URL
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      });
    });
  } catch (error) {
    console.error("❌ Error authenticating with GitHub:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ status: "error", message: "Authentication failed" });
    }
  }
};

/**
 * Returns the currently authenticated user's session data.
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      data: {
        id: req.user.id,
        userId: req.user.userId,
        login: req.session.login || `user_${req.user.userId}`,
        name: req.session.name || null,
        avatar_url: req.session.avatar_url || null,
        repos_url: req.session.repos_url || `https://api.github.com/user/${req.user.userId}/repos`,
      },
    });
  } catch (error) {
    console.error("❌ Error in getMe:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch user session",
    });
  }
};

/**
 * Destroys the server-side session and clears the HTTP-only cookie.
 */
const logout = async (req, res) => {
  try {
    const cookieName = "sid";
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error destroying session:", err);
        return res.status(500).json({
          status: "error",
          message: "Failed to log out",
        });
      }

      res.clearCookie(cookieName, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to log out",
    });
  }
};

module.exports = {
  githubCallback,
  getMe,
  logout,
};
