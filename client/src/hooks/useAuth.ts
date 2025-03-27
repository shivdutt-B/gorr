import { v4 as uuidv4 } from "uuid"; // For generating random strings

const useGitHubOAuth = (clientId, redirectUri, scope = "repo") => {
    const initiateOAuth = () => {
        // Generate a random string for the CSRF token using uuid
        const state = uuidv4();
        localStorage.setItem("latestCSRFToken", state);

        // Construct the GitHub OAuth URL
        const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;

        // Redirect the user to GitHub
        window.location.assign(githubOAuthUrl);
    };

    return initiateOAuth; // Return the function to initiate OAuth
};

export default useGitHubOAuth;