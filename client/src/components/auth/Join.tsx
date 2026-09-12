import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import GorrLogo from "../../assets/Logo/gorr_logo.svg";
import GitHubLogo from "../../assets/others/github.png";

export function Join() {
  const initiateOAuth = () => {
    const state = crypto.randomUUID();
    localStorage.setItem("latestCSRFToken", state);
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URL;
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&response_type=code&scope=repo&redirect_uri=${redirectUri}&state=${state}`
    );
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-[hsl(var(--bg))]
        px-5
        py-10
      "
    >

      {/* ───────────────────── CONTENT ───────────────────── */}

      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-[400px]
          flex-col
          items-center
        "
      >
        {/* GORR LOGO */}

        <div className="flex items-center gap-5">
          <div
            className="
            flex
            h-[64px]
            w-[64px]
            items-center
            justify-center
            rounded-full
            border
            bg-white
          "
          >
            <img
              src={GorrLogo}
              alt="GORR"
              className="
              h-9
              w-9
              object-contain
            "
            />
          </div>
          <div>
            <span className="text-[hsl(var(--accent))] font-extrabold">X</span>
          </div>
          <div
            className="
            flex
            h-[64px]
            w-[64px]
            items-center
            justify-center
            rounded-full
            border
            bg-white
          "
          >
            <img
              src={GitHubLogo}
              alt="GORR"
              className="
              h-9
              w-9
              object-contain
            "
            />
          </div>
        </div>

        {/* ───────────────────── HEADING ───────────────────── */}

        <div className="mt-7 text-center">
          <h1
            className="
              mt-3
              font-serif
              text-[clamp(2.2rem,7vw,3.1rem)]
              font-normal
              leading-[1]
              tracking-[-0.04em]
              text-[hsl(var(--text-primary))]
            "
          >
            Start <span className="text-accent">deploying.</span>
          </h1>

          <p
            className="
              mx-auto
              mt-4
              max-w-[350px]
              text-[0.9rem]
              leading-[1.65]
              text-[hsl(var(--text-secondary))]
            "
          >
            Connect your GitHub account to start deploying your applications
            with GORR.
          </p>
        </div>

        {/* ───────────────────── GITHUB ACTION ───────────────────── */}

        <div
          className="
            mt-8
            w-[300px]
            pt-5
          "
        >
          <button
            type="button"
            onClick={initiateOAuth}
            className="
              group
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-[4px]
              bg-accent
              px-5
              text-sm
              font-medium
              text-black
              transition-all
              duration-300
              hover:bg-[hsl(var(--accent-strong))]
              hover:shadow-[0_0_35px_hsl(var(--accent)/0.14)]
              active:scale-[0.99]
            "
          >
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div
          className="
            mt-0
            w-[300px]
            border-t
            border-white/[0.07]
            pt-5
          "
        >
          <Link
            to="/"
            className="
              group
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-full
              bg-transparent
              px-5
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              active:scale-[0.99]
              hover:text-[hsl(var(--accent))]
            "
          ><ArrowLeft className="h-4 w-4 mr-[-5px]"/>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
