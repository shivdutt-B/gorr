import { useState, useEffect } from "react";
import axios from "axios";

type DomainStatus = "checking" | "available" | "unavailable" | "idle" | "invalid";

export const useSlugAvailability = (slug: string) => {
  const [domainStatus, setDomainStatus] = useState<DomainStatus>("idle");
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    if (slug.trim() === "") {
      setDomainStatus("idle");
      return;
    }

    // Check if the domain name contains spaces
    if (slug.includes(" ")) {
      setDomainStatus("invalid");
      return;
    }

    // Set status to checking
    setDomainStatus("checking");

    // Create a new timeout
    const timeout = setTimeout(async () => {
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/check-slug?slug=${encodeURIComponent(slug)}` || `http://localhost:5000/check-slug?slug=${encodeURIComponent(slug)}`
        
        const response = await axios.get(url);

        setDomainStatus(response.data.available ? "available" : "unavailable");
      } catch (error) {
        console.error("Error checking domain availability:", error);
        setDomainStatus("unavailable");
      }
    }, 500);

    setCheckTimeout(timeout);

    // Cleanup function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [slug]);

  return { domainStatus };
}; 