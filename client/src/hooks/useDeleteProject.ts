import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface DeleteProjectParams {
  slug: string;
  userId?: number;
}

interface DeleteProjectResponse {
  status: string;
  message: string;
  data?: {
    slug: string;
  };
}

export const useDeleteProject = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = async ({ slug }: DeleteProjectParams): Promise<DeleteProjectResponse | null> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await axios.post<DeleteProjectResponse>(
        `${API_BASE_URL}/delete-project`,
        { slug },
        { withCredentials: true }
      );

      if (response.data.status === "error") {
        setIsDeleting(false);
        setError(response.data.message);
        return null;
      }

      return response.data;
    } catch (err) {
      console.error("ERROR deleting project:", err);
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete project";

      setError(errorMessage);
      return null;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProject,
    isDeleting,
    error,
  };
};