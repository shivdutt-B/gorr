import React from "react";
import { Button } from "./LoadingBtnSource";
import Failed from "../../assets/Loading/failed.svg";
import { Link } from "react-router-dom";

interface TryAgainSourceProps {
  onClick?: () => void;
  message?: string;
}

export function TryAgainSource({ onClick, message = "Request cannot be processed." }: TryAgainSourceProps) {
  return (
    <div className="flex gap-4 flex-col flex-wrap justify-center items-center h-screen">
      <div className="flex flex-col gap-3 items-center h-[450px] w-[380px] justify-center rounded-lg">
        <div>
          <img className="w-20" src={Failed} alt="" />
        </div>
        <div>{message}</div>
        <div className="flex flex-col gap-2">
          <Link to="/">
            <Button className="bg-blue-500 text-black flex items-center gap-2 px-4 py-2 w-32">
              Back home
            </Button>
          </Link>
          <Button
            onClick={onClick}
            className="bg-green-500 text-black flex items-center gap-2 px-4 py-2 w-32"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
