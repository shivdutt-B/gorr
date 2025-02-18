import React, { useEffect } from "react";
import axios from "axios";
import { ButtonLoading } from "../components/ui/LoadingBtn";

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
                        client_id: import.meta.env.GITHUB_CLIENT_ID,
                        client_secret: import.meta.env.GITHUB_CLIENT_SECRET, // Fixed env variable
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




// ====================================================================================

import React, { useEffect } from "react";
import axios from "axios";
import { useLoading } from "../hooks/useLoading"; // Import the custom hook
import { useRecoilValue } from "recoil";
import { loadingAtom } from "../states/loadingAtom";

function AuthDone() {
    const { startLoading, stopLoading, cancelRequest } = useLoading();
    const { loading } = useRecoilValue(loadingAtom);

    async function getUser() {
        console.log("User data:", window.location);

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
            console.error("Authorization code is missing");
            return;
        }

        const signal = startLoading(); // Start loading and get the abort signal

        try {
            // Exchange code for access token
            const tokenResponse = await axios.post(
                "https://github.com/login/oauth/access_token",
                null,
                {
                    params: {
                        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID, // Use VITE_ prefix for Vite env variables
                        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
                        code,
                    },
                    headers: { Accept: "application/json" },
                    signal, // Pass abort signal
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
                signal, // Pass abort signal
            });

            console.log("USER:", userResponse.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled:", error.message);
            } else {
                console.error("Error fetching user:", error);
            }
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div>
            <h2>AuthDone</h2>
            {loading && (
                <div>
                    <div onClick={cancelRequest}>
                        <ButtonLoading></ButtonLoading>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthDone;
