import React, { useEffect, useState } from "react";
import {
  Hammer,
  Rocket,
  Check,
  Github,
  GitBranch,
  ArrowUpRight,
  Server,
  Globe2,
  Clock3,
  User,
} from "lucide-react";

import gorrLogo from "../../assets/Logo/gorr_logo.svg";

export function DeploymentSteps() {
  const [progress, setProgress] = useState(0);

  // Deployment progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          return 0;
        }

        return current + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-8 sm:py-12">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 60% at 50% 50%,
              hsl(var(--accent) / 0.025) 0%,
              transparent 70%
            )
          `,
        }}
      />

      <div className="container-gutter relative z-10">
        {/* Header */}
        <div className="max-w-2xl">
          <h2
            className="
              mt-4
              font-serif
              text-[clamp(2rem,4vw,3.5rem)]
              font-normal
              leading-[1.08]
              tracking-[-0.025em]
              text-[hsl(var(--text-primary))]
            "
          >
            From code to <span className="text-accent">production.</span>
          </h2>

          <p
            className="
              mt-5
              max-w-xl
              text-[1rem]
              font-normal
              leading-relaxed
              text-[hsl(var(--text-secondary))]
              sm:text-[1.05rem]
            "
          >
            GORR takes care of the entire deployment workflow, from building
            your application to making it live.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-14 lg:grid-cols-4 mt-12">
          {/* =====================================================
              STEP 01 — PUSH YOUR CODE
          ===================================================== */}
          <div className="relative">
            <div
              className="
                group
                h-full
                rounded-2xl
              "
            >
              <h3
                className="
                  font-serif
                  text-[1.35rem]
                  font-normal
                  tracking-[-0.015em]
                  text-[hsl(var(--text-primary))]
                "
              >
                01. <span className="text-accent">Code</span>
              </h3>

              <p
                className="
                  mt-2
                  min-h-[48px]
                  text-sm
                  font-normal
                  leading-6
                  text-[hsl(var(--text-secondary))]
                "
              >
                Connect your repository and push your application to GORR.
              </p>

              {/* GitHub → GORR */}
              <div
                className="
                  mt-7
                  rounded-xl
                "
              >
                {/* Connection */}
                <div className="flex items-center">
                  {/* GitHub */}
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                      "
                    >
                      <Github className="h-5 w-5 text-black" strokeWidth={1} />
                    </div>

                    <span className="text-[0.65rem] text-[hsl(var(--text-secondary))]">
                      GitHub
                    </span>
                  </div>

                  {/* Animated beam */}
                  <div className="flex flex-1 items-center px-3">
                    <div className="relative h-px w-full overflow-hidden">
                      <div className="absolute inset-0 bg-[hsl(var(--border)/0.5)]" />

                      <div
                        className="
                          absolute
                          inset-y-0
                          left-0
                          w-2/3
                          bg-gradient-to-r
                          from-transparent
                          via-[hsl(var(--accent))]
                          to-transparent
                          animate-github-beam
                        "
                      />
                    </div>
                  </div>

                  {/* GORR */}
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <img
                        src={gorrLogo}
                        alt="GORR"
                        className="h-5 w-5 object-contain"
                      />
                    </div>

                    <span className="text-[0.65rem] text-[hsl(var(--text-secondary))]">
                      GORR
                    </span>
                  </div>
                </div>

                {/* Repository information */}
                <div
                  className="
                    mt-4
                    space-y-2.5
                    border-t
                    border-[hsl(var(--border)/0.25)]
                    pt-3
                  "
                >
                  {/* User / repository */}
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <User
                        className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                        strokeWidth={1.5}
                      />

                      <span className="text-[0.7rem] text-[hsl(var(--text-secondary))]">
                        shivdutt-B
                      </span>
                    </div>

                    {/* Repository */}
                    <div className="flex items-center gap-2">
                      <Github
                        className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                        strokeWidth={1.5}
                      />

                      <span className="text-[0.7rem] text-[hsl(var(--text-secondary))]">
                        shivdutt/gorr
                      </span>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch
                        className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                        strokeWidth={1.5}
                      />

                      <span className="text-[0.7rem] text-[hsl(var(--text-secondary))]">
                        main
                      </span>
                    </div>

                    <span className="flex items-center gap-1.5 text-[0.65rem] text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              STEP 02 — BUILD
          ===================================================== */}
          <div className="relative">
            <div
              className="
                group
                h-full
                rounded-2xl
              "
            >
              <h3
                className="
                  font-serif
                  text-[1.35rem]
                  font-normal
                  tracking-[-0.015em]
                  text-[hsl(var(--text-primary))]
                "
              >
                02. <span className="text-accent">Build</span>
              </h3>

              <p
                className="
                  mt-2
                  min-h-[48px]
                  text-sm
                  font-normal
                  leading-6
                  text-[hsl(var(--text-secondary))]
                "
              >
                GORR installs dependencies and builds your application
                automatically.
              </p>

              {/* Build logs */}
              <div
                className="
                  relative
                  mt-7
                  h-[130px]
                  overflow-hidden

                "
              >
                {/* Fade */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    right-0
                    top-0
                    z-10
                    h-8

                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-10
                    h-8

                  "
                />

                <div
                  className="
                    absolute
                    left-4
                    right-4
                    top-0
                    font-mono
                    text-[0.68rem]
                    leading-6
                    animate-build-logs
                  "
                >
                  <p className="text-[hsl(var(--text-muted))]">$ npm install</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    installing dependencies...
                  </p>

                  <p className="text-accent">✓ dependencies installed</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    $ npm run build
                  </p>

                  <p className="text-[hsl(var(--text-muted))]">
                    building application...
                  </p>

                  <p className="text-accent">✓ build completed</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    optimizing assets...
                  </p>

                  <p className="text-accent">✓ assets optimized</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    creating production bundle...
                  </p>

                  <p className="text-accent">✓ production ready</p>

                  <p className="text-[hsl(var(--text-muted))]">$ npm install</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    installing dependencies...
                  </p>

                  <p className="text-accent">✓ dependencies installed</p>

                  <p className="text-[hsl(var(--text-muted))]">
                    $ npm run build
                  </p>

                  <p className="text-[hsl(var(--text-muted))]">
                    building application...
                  </p>

                  <p className="text-accent">✓ build completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              STEP 03 — DEPLOY
          ===================================================== */}
          <div className="relative">
            <div
              className="
                group
                h-full
                rounded-2xl
              "
            >
              <h3
                className="
                  font-serif
                  text-[1.35rem]
                  font-normal
                  tracking-[-0.015em]
                  text-[hsl(var(--text-primary))]
                "
              >
                03. <span className="text-accent"> Deploy</span>
              </h3>

              <p
                className="
                  mt-2
                  min-h-[48px]
                  text-sm
                  font-normal
                  leading-6
                  text-[hsl(var(--text-secondary))]
                "
              >
                Your build is packaged and deployed to scalable cloud
                infrastructure.
              </p>

              {/* Deployment panel */}
              <div
                className="
                  mt-7
                "
              >
                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-[hsl(var(--accent)/0.08)]
                      "
                    >
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--accent))]" />
                    </span>

                    <div>
                      <p className="text-xs font-normal text-[hsl(var(--text-primary))]">
                        Deploying
                      </p>

                      <p className="mt-0.5 text-[0.65rem] text-[hsl(var(--text-muted))]">
                        Starting container
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-[hsl(var(--text-secondary))]">
                    {progress}%
                  </span>
                </div>

                {/* Progress */}
                <div
                  className="
                    mt-4
                    h-1
                    overflow-hidden
                    rounded-full
                    bg-[hsl(var(--border)/0.5)]
                  "
                >
                  <div
                    className="h-full rounded-full bg-[hsl(var(--accent))] transition-[width] duration-75 ease-linear"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                {/* Deployment details */}
                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-2
                    border-t
                    border-[hsl(var(--border)/0.25)]
                    pt-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <Server
                      className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                      strokeWidth={1.5}
                    />

                    <div>
                      <p className="text-[0.6rem] text-[hsl(var(--text-muted))]">
                        Environment
                      </p>

                      <p className="text-[0.68rem] text-[hsl(var(--text-secondary))]">
                        Production
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe2
                      className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                      strokeWidth={1.5}
                    />

                    <div>
                      <p className="text-[0.6rem] text-[hsl(var(--text-muted))]">
                        Region
                      </p>

                      <p className="text-[0.68rem] text-[hsl(var(--text-secondary))]">
                        AWS · Mumbai
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              STEP 04 — GO LIVE
          ===================================================== */}
          <div className="relative">
            <div
              className="
                group
                h-full
                rounded-2xl
              "
            >
              <h3
                className="
                  font-serif
                  text-[1.35rem]
                  font-normal
                  tracking-[-0.015em]
                  text-[hsl(var(--text-primary))]
                "
              >
                04. <span className="text-accent">Live</span>
              </h3>

              <p
                className="
                  mt-2
                  min-h-[48px]
                  text-sm
                  font-normal
                  leading-6
                  text-[hsl(var(--text-secondary))]
                "
              >
                Your application is live and accessible through its deployment
                URL.
              </p>

              {/* Live deployment */}
              <div
                className="
                  mt-7"
              >
                {/* Status */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-[hsl(var(--accent))]
                    "
                  >
                    <Check
                      className="h-3.5 w-3.5 text-[#030303]"
                      strokeWidth={2.5}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-normal text-[hsl(var(--text-primary))]">
                      Deployment successful
                    </p>

                    <p className="mt-1 text-[0.65rem] text-[hsl(var(--text-muted))]">
                      Application is live
                    </p>
                  </div>
                </div>

                {/* URL */}
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-full
                    bg-[hsl(var(--text-primary)/0.04)]
                    px-3
                    py-2.5
                  "
                >
                  <span className="text-[0.7rem] text-[hsl(var(--text-secondary))]">
                    my-project.gorr.dev
                  </span>

                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-[hsl(var(--text-muted))]"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Live metrics */}
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[hsl(var(--border)/0.25)]
                    pt-3
                  "
                >
                </div>
              </div>

              {/* Extra live indicator */}
              <div className=" flex items-center justify-between">
                <span className="text-[0.65rem] text-[hsl(var(--text-muted))]">
                  Production
                </span>

                <span className="text-[0.65rem] text-accent">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
