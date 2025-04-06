import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface DeleteProjectParams {
  userId: number;
  slug: string;
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

  const deleteProject = async ({ userId, slug }: DeleteProjectParams): Promise<DeleteProjectResponse | null> => {
    setIsDeleting(true);
    setError(null);

    try {
      // throw new Error("Invalid response received from server");
      const response = await axios.post<DeleteProjectResponse>(
        `${API_BASE_URL}/delete-project`,
        { userId, slug }
      );

      // Check if the response is valid
      
      if (response.data.status == "error") {
        setIsDeleting(false);
        setError(response.data.message);
        return null;
      }

      console.log(response.data);

      return response.data;
    } catch (err) {
      console.log('ERROR: ', err);
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