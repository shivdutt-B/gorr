require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// const FRONTEND_URL = "https://gorr-lyart.vercel.app"; // Update with your frontend URL
const FRONTEND_URL = "http://localhost:5173"

// Step 1: Redirect user to GitHub OAuth
app.get("/auth/github", (req, res) => {
    console.log('REACHED')
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`;
    res.redirect(redirectUrl);
});

// Step 2: GitHub redirects back with a code
app.get("/auth/github/callback", async (req, res) => {
    console.log('REACHED2')
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "Authorization code missing" });

    try {
        // Step 3: Exchange code for access token
        const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
            },
            headers: { Accept: "application/json" },
        });

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) return res.status(400).json({ error: "Failed to get access token" });

        // Step 4: Fetch user details
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${accessToken}` },
        });

        const userData = userResponse.data;

        // Redirect to frontend with user data (or store it in session)
        res.redirect(`${FRONTEND_URL}/auth_done?user=${encodeURIComponent(JSON.stringify(userData))}`)
        // res.redirect(`${FRONTEND_URL}/auth_done`)
        // res.json({"success":"true", 'user': userData})

    } catch (error) {
        console.error("Error authenticating with GitHub:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
