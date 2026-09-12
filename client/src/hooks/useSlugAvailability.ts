import { useState, useEffect } from "react";
import axios from "axios";

type DomainStatus = "checking" | "available" | "unavailable" | "idle" | "invalid";

export const useSlugAvailability = (slug: string) => {
  const [domainStatus, setDomainStatus] = useState<DomainStatus>("idle");

  useEffect(() => {
    if (slug.trim() === "") {
      setDomainStatus("idle");
      return;
    }

    if (slug.includes(" ")) {
      setDomainStatus("invalid");
      return;
    }

    setDomainStatus("checking");

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const timeout = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/check-slug?slug=${encodeURIComponent(slug)}`
        );
        setDomainStatus(response.data.available ? "available" : "unavailable");
      } catch (error) {
        console.error("Error checking domain availability:", error);
        setDomainStatus("unavailable");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [slug]);

  return { domainStatus };
}; 