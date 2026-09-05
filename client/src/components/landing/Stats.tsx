"use client";

import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { Terminal, Check, Globe, GitBranch, Cpu, Clock } from "lucide-react";

type StatsProps = {
  className?: string;
};

export function Stats({ className }: StatsProps) {
  // Step in the deployment simulation (0 to 6)
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (step === 0) {
      setProgress(0);
      timer = setTimeout(() => setStep(1), 900);
    } else if (step === 1) {
      timer = setTimeout(() => setStep(2), 1200);
    } else if (step === 2) {
      timer = setTimeout(() => {
        setStep(3);
        setProgress(28);
      }, 1100);
    } else if (step === 3) {
      const t1 = setTimeout(() => setProgress(56), 400);
      const t2 = setTimeout(() => setProgress(78), 800);
      const t3 = setTimeout(() => {
        setProgress(100);
        setStep(4);
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (step === 4) {
      timer = setTimeout(() => setStep(5), 1100);
    } else if (step === 5) {
      timer = setTimeout(() => setStep(6), 1200);
    } else if (step === 6) {
      timer = setTimeout(() => {
        setStep(0);
      }, 4200);
    }

    return () => clearTimeout(timer);
  }, [step]);

  const totalBlocks = 18;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const asciiBar = "█".repeat(filledBlocks) + "░".repeat(Math.max(0, emptyBlocks));

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-transparent",
        className
      )}
    >
      {/* Soft ambient center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-full max-w-5xl bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,hsl(var(--accent)/0.05),transparent_70%)]" />

      <div className="container-gutter relative z-10">
        {/* ─── Left-aligned Top Header with font-serif ─── */}
        <div className="flex max-w-3xl flex-col items-start text-left">
          {/* Heading */}
          <h2 className="mt-5 text-[clamp(2.2rem,4vw,3.8rem)] font-normal leading-[1.08] tracking-[-0.02em] text-[hsl(var(--text-primary))] font-serif">
            Know what&apos;s happening.{" "}
            <span className="text-[hsl(var(--accent))]">The moment it happens.</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-[hsl(var(--text-secondary))] sm:text-[1.15rem]">
            Real-time deployment visibility. No refreshing. No guessing. GORR
            streams build and deployment events directly to your dashboard.
          </p>
        </div>

        {/* ─── Main Content: Terminal & Logs Showcase ─── */}
        <div className="mt-10 sm:mt-12">
          <div className="relative w-full max-w-4xl">
            {/* Outer subtle glow */}
            <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-b from-[hsl(var(--accent)/0.15)] via-[hsl(var(--accent)/0.03)] to-transparent opacity-70 blur-md" />

            {/* Terminal Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090b0e]/95 shadow-panel-strong backdrop-blur-2xl">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-3 sm:px-6 sm:py-3.5">
                {/* Left: Window dots + project target */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                  </div>

                  <div className="h-4 w-[1px] bg-white/10" />

                  <div className="flex items-center gap-2 font-mono text-xs text-[hsl(var(--text-secondary))]">
                    <Terminal className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                    <span className="text-white font-medium">gorr</span>
                    <span className="text-white/30">/</span>
                    <span className="text-[hsl(var(--text-muted))]">production-deploy</span>
                  </div>
                </div>

                {/* Right: Meta indicators & LIVE pill */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[hsl(var(--text-muted))]">
                    <GitBranch className="h-3 w-3" />
                    <span>main</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[hsl(var(--text-muted))]">
                    <Cpu className="h-3 w-3" />
                    <span>us-east-1</span>
                  </div>

                  {step >= 6 ? (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))/0.3] bg-[hsl(var(--accent))/0.12] px-2.5 py-0.5 text-[0.7rem] font-mono font-medium text-[hsl(var(--accent))]">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      <span>DEPLOYED</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--accent))/0.25] bg-[hsl(var(--accent))/0.1] px-2.5 py-0.5 text-[0.7rem] font-mono font-semibold text-[hsl(var(--accent))] shadow-[0_0_12px_hsl(var(--accent)/0.15)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent))] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                      </span>
                      <span>LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Logs & Progress Body */}
              <div className="p-5 sm:p-8 font-mono text-[0.82rem] sm:text-[0.9rem] leading-relaxed">
                <div className="space-y-4 sm:space-y-5">
                  {/* Step 0 & 1: npm install */}
                  <div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-[hsl(var(--accent))] font-bold">$</span>
                      <span>npm install</span>
                    </div>
                    {step >= 1 && (
                      <div className="mt-1.5 flex items-center gap-2 text-[hsl(var(--accent))] transition-all">
                        <span className="text-xs">✓</span>
                        <span>dependencies installed</span>
                        <span className="text-xs text-[hsl(var(--text-muted))]">(0.8s)</span>
                      </div>
                    )}
                  </div>

                  {/* Step 2: npm run build */}
                  {step >= 1 && (
                    <div className="transition-all duration-200">
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-[hsl(var(--accent))] font-bold">$</span>
                        <span>npm run build</span>
                      </div>
                      {step >= 2 && (
                        <div className="mt-1.5 flex items-center gap-2 text-[hsl(var(--accent))]">
                          <span className="text-xs">✓</span>
                          <span>build completed</span>
                          <span className="text-xs text-[hsl(var(--text-muted))]">(dist/ 3.4 MB)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Uploading artifacts + Interactive Progress */}
                  {step >= 2 && (
                    <div className="space-y-2 transition-all duration-200">
                      <div className="flex items-center justify-between text-[hsl(var(--text-secondary))]">
                        <span>Uploading artifacts...</span>
                        <span className="text-xs font-mono text-[hsl(var(--text-muted))]">
                          {progress}%
                        </span>
                      </div>

                      {/* Visual Sleek Progress Bar */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[hsl(var(--accent))] transition-all duration-300 ease-out shadow-[0_0_10px_hsl(var(--accent)/0.6)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Monospace ASCII bar display */}
                      <div className="flex items-center gap-2 text-[hsl(var(--accent))] text-xs select-none">
                        <span className="tracking-tight">{asciiBar}</span>
                        <span className="text-[hsl(var(--text-muted))]">
                          {progress === 100 ? "uploaded" : "transferring"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Connecting to ECS */}
                  {step >= 4 && (
                    <div className="space-y-1.5 transition-all duration-200">
                      <div className="text-[hsl(var(--text-secondary))]">
                        Connecting to ECS...
                      </div>
                      <div className="flex items-center gap-2 text-amber-400/90">
                        <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>container starting</span>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Waiting for deployment */}
                  {step === 5 && (
                    <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))] transition-all duration-200">
                      <span>Waiting for deployment...</span>
                      <span className="inline-block h-4 w-1.5 animate-pulse bg-[hsl(var(--accent))] align-middle" />
                    </div>
                  )}

                  {/* Step 6: Final Deployment Success */}
                  {step >= 6 && (
                    <div className="mt-2 rounded-xl border border-[hsl(var(--accent))/0.25] bg-[hsl(var(--accent))/0.08] p-4 text-[hsl(var(--accent))] transition-all duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-semibold">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 stroke-[2.5]" />
                          <span>Deployment successful</span>
                        </div>
                        <span className="text-xs font-normal text-[hsl(var(--text-muted))]">
                          Total: 2.9s
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-[hsl(var(--text-secondary))]">
                        <Globe className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                        <span>Live endpoint:</span>
                        <a
                          href="https://my-app.gorrproxy.xyz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[hsl(var(--accent))] underline underline-offset-2 hover:opacity-80"
                        >
                          https://my-app.gorrproxy.xyz
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Blinking cursor when running */}
                  {step < 5 && (
                    <div className="inline-flex items-center pt-1">
                      <span className="inline-block h-4 w-1.5 animate-pulse bg-[hsl(var(--accent))]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Footer Strip */}
              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-5 py-2.5 font-mono text-[0.72rem] text-[hsl(var(--text-muted))]">
                <div className="flex items-center gap-4">
                  <span>runtime: nodejs20.x</span>
                  <span className="hidden sm:inline">ssl: tls1.3 active</span>
                </div>
                <div className="flex items-center gap-1.5 text-[hsl(var(--text-muted))]">
                  <Clock className="h-3 w-3" />
                  <span>real-time stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
