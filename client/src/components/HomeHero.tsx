import React from "react";
import { ArrowUpRight } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.16),transparent_24%),radial-gradient(circle_at_20%_35%,rgba(168,85,247,0.16),transparent_20%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.05),transparent_16%),linear-gradient(180deg,hsl(var(--bg-elevated))_0%,hsl(var(--bg))_65%,hsl(var(--bg))_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="mt-6 text-[clamp(3rem,6.5vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-foreground">
            The Foundation for your Design System
          </h1>

          <p className="mt-6 max-w-3xl text-[1.05rem] leading-relaxed text-foreground-muted sm:text-[1.2rem]">
            A set of beautifully designed components that you can customize,
            extend, and build on. Start here then make it your own. Open Source.
            Open Code.
          </p>

          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center rounded-[4px] bg-[hsl(var(--accent))] px-5 py-2.5 text-md text-black transition-transform hover:-translate-y-0.5 font-semibold"
          >
            Build Your Own <span className="ml-2 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="h-5 w-5" /> 
                </span>
          </a>
        </div>
      </div>
    </section>
  );
}
