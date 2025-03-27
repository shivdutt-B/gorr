import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";

export const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);

  const logout = async () => {
    try {
      // Clear user data from Recoil state
      setUser(null);
      
      // Clear cookies by setting them to expire
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "github_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear CSRF token from local storage
      localStorage.removeItem("latestCSRFToken");
      
      // Reset axios default headers if you're using them
      delete axios.defaults.headers.common["Authorization"];
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { logout };
}; 