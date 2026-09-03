import React from "react";
import { ChevronRight } from "lucide-react";

// Import tech logos
import reactLogo from "../../assets/tech/react.svg";
import vueLogo from "../../assets/tech/vue.svg";
import angularLogo from "../../assets/tech/angular.svg";
import htmlLogo from "../../assets/tech/html.svg";
import cssLogo from "../../assets/tech/css.svg";
import jsLogo from "../../assets/tech/javascript.svg";
import tsLogo from "../../assets/tech/typescript.svg";
import astroLogo from "../../assets/tech/astro.svg";
import svelteLogo from "../../assets/tech/svelte.svg";

const techStack = [
  { name: "React", logo: reactLogo },
  { name: "Vue", logo: vueLogo },
  { name: "Angular", logo: angularLogo },
  { name: "HTML", logo: htmlLogo },
  { name: "CSS", logo: cssLogo },
  { name: "JavaScript", logo: jsLogo },
  { name: "TypeScript", logo: tsLogo },
  { name: "Astro", logo: astroLogo },
  { name: "Svelte", logo: svelteLogo },
];

export function Hero() {
  // Duplicate once for seamless loop
  const items = [...techStack, ...techStack];

  return (
    <section className="relative flex min-h-[520px] w-full items-center overflow-hidden px-6 py-20 sm:px-12 lg:px-20">
      {/* Base background */}
      <div className="absolute inset-0 bg-[hsl(var(--bg))]" />

      {/* Top-down light spread */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 160% 120% at 50% 0%,
              hsl(var(--accent) / 0.10) 0%,
              hsl(var(--accent) / 0.075) 30%,
              hsl(var(--accent) / 0.045) 55%,
              hsl(var(--accent) / 0.02) 75%,
              transparent 100%
            ),
            linear-gradient(
              180deg,
              hsl(var(--bg-elevated)) 0%,
              hsl(var(--bg)) 100%
            )
          `,
        }}
      />

      {/* Subtle ambient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 40%, transparent 30%, hsl(var(--bg) / 0.6) 100%)`,
        }}
      />

      {/* Fine grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <div className="flex max-w-4xl flex-col items-start text-left">
          {/* Heading */}
          <h1 className="text-[clamp(2.2rem,4vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[hsl(var(--text-primary))] font-serif">
            Microservices Deployment Platform
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[hsl(var(--text-secondary))] sm:text-[1.15rem]">
            Deploy full-stack applications with real-time monitoring and
            seamless cloud integration.
          </p>

          {/* Tech stack marquee */}
          <div className="mt-8 w-full overflow-hidden">
            <div
              className="flex w-max animate-marquee items-center gap-x-8"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              }}
            >
              {items.map((tech, i) => (
                <div
                  key={`${tech.name}-${i}`}
                  className="flex items-center gap-2.5 text-[0.9rem] text-[hsl(var(--text-muted))] whitespace-nowrap"
                >
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    className="h-4 w-4 object-contain flex-shrink-0"
                  />
                  <span className="font-medium text-sm">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#"
            className="mt-10 inline-flex min-w-[150px] items-center rounded-full bg-[hsl(var(--accent))] px-2 py-2 text-[0.85rem] font-medium text-[#030303] transition-all hover:bg-[hsl(var(--accent-strong))]"
          >
            <span className="flex-1 text-center">Start Free Trial</span>

            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <ChevronRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
