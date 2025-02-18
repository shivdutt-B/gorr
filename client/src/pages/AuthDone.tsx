import React, { useEffect } from "react";
import axios from "axios";

function AuthDone() {
    async function getUser() {
        console.log("User data:", window.location);

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            console.error("Authorization code is missing");
            return;
        }

        try {
            // Exchange code for access token
            const tokenResponse = await axios.post(
                "https://github.com/login/oauth/access_token",
                null,
                {
                    params: {
                        client_id: import.meta.env.VITE_CLIENT_ID,
                        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET, // Fixed env variable
                        code,
                    },
                    headers: { Accept: "application/json" },
                }
            );

            const accessToken = tokenResponse.data.access_token;

            if (!accessToken) {
                console.error("Failed to retrieve access token");
                return;
            }

            // Fetch user details
            const userResponse = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `token ${accessToken}` },
            });

            console.log("USER:", userResponse.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return <div>AuthDone</div>;
}

export default AuthDone;
