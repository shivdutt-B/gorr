import { useEffect } from "react";
import crypto from "crypto-browserify"; // For generating random bytes

const useGitHubOAuth = (clientId, redirectUri, scope = "repo") => {
  useEffect(() => {
    // Generate a CSRF token and store it in localStorage
    const state = crypto.randomBytes(16).toString("hex");
    localStorage.setItem("latestCSRFToken", state);

    // Construct the GitHub OAuth URL
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;

    // Redirect the user to GitHub
    window.location.assign(githubOAuthUrl);
  }, [clientId, redirectUri, scope]);
};

export default useGitHubOAuth;