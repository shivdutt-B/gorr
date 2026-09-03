import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.16),transparent_24%),radial-gradient(circle_at_20%_35%,rgba(168,85,247,0.16),transparent_20%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.05),transparent_16%),linear-gradient(180deg,hsl(var(--bg-elevated))_0%,hsl(var(--bg))_65%,hsl(var(--bg))_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative z-10 w-full max-w-7xl">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-foreground-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Microservices-based Deployment Platform
          </div>

          <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
            Deploy Faster.
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Monitor Smarter.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-[1.05rem] leading-relaxed text-foreground-muted sm:text-[1.25rem]">
            Streamline your deployments with real-time monitoring, intelligent
            microservices architecture, and seamless cloud integration.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/join"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">5</div>
              <div className="mt-1 text-sm text-foreground-muted">
                Microservices
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">Real-time</div>
              <div className="mt-1 text-sm text-foreground-muted">
                Monitoring
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">AWS</div>
              <div className="mt-1 text-sm text-foreground-muted">
                Integration
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
