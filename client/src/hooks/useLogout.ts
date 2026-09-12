import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const setProjects = useSetRecoilState(projectsAtom);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Call server-side logout endpoint to destroy session and clear HTTP-only cookie
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error during server logout:", error);
    } finally {
      // Clear local application state
      setUser(null);
      setProjects(null);
      localStorage.removeItem("latestCSRFToken");

      // Redirect to home page
      navigate("/");
    }
  };

  return { logout };
};