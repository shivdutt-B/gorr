import React, { useEffect } from 'react'
import axios from 'axios'

function AuthDone() {
    async function getUser() {

        console.log("user data", window.location)

        console.log('REACHED2')
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        // if (!code) return res.status(400).json({ error: "Authorization code missing" });

        try {
            // Step 3: Exchange code for access token
            const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", null, {
                params: {
                    client_id: import.meta.env.VITE_CLIENT_ID,
                    client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                headers: { Accept: "application/json" },
            });

            const accessToken = tokenResponse.data.access_token;

            // if (!accessToken) return res.status(400).json({ error: "Failed to get access token" });

            // Step 4: Fetch user details
            const userResponse = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `token ${accessToken}` },
            });
            console.log('USER', userResponse)
        }

    }
    useEffect(() => {
        getUser();
    }, [])
    return (
        <div>AuthDone</div>
    )
}

export default AuthDone