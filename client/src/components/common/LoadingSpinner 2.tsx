import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-row items-center justify-center gap-4">
        <div className="w-7 h-7 rounded-full relative animate-spin">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff00cc] via-[#ff9500] to-[#00ff88]"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-[#ffcc00] via-[#00ffff] to-[#9c42f5]"></div>
          <div className="absolute inset-1 rounded-full bg-[#0a0a0a]"></div>
        </div>
        <p className="text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
};
