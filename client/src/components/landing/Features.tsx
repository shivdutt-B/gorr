import React from "react";
import { Activity, Server, Users } from "lucide-react";

import observabilityImage from "../../assets/features/observibility.png";
import scalingImage from "../../assets/features/scaling.png";
import teamImage from "../../assets/features/team.png";

const features = [
  {
    title: "Live observability",
    highlight: "observability",
    description:
      "Follow every build, deploy, and runtime event from one clear command center.",
    icon: Activity,
    imageLabel: "Live monitoring",
    image: observabilityImage,
  },
  {
    title: "Infrastructure that scales",
    highlight: "scales",
    description:
      "Move from your first release to production traffic without changing your workflow.",
    icon: Server,
    imageLabel: "Cloud infrastructure",
    image: scalingImage,
  },
  {
    title: "Teams move together",
    highlight: "together",
    description:
      "Give every contributor a reliable path from pull request to production.",
    icon: Users,
    imageLabel: "Team workflow",
    image: teamImage,
  },
];

export function Features() {
  return (
    <section className="relative w-full overflow-hidden bg-transparent py-8 sm:py-12">
      {/* Subtle background vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 35%, hsl(var(--bg) / 0.35) 100%)",
        }}
      />

      <div className="container-gutter relative z-10">
        {/* ───────────────────── HEADER ───────────────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:gap-20">
          <div>
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
              Make every release
              <span className="text-accent"> feel effortless.</span>
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
        </div>

        {/* ───────────────────── FEATURE CARDS ───────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const titleParts = feature.title.split(feature.highlight);

            return (
              <article
                key={feature.title}
                className="group relative flex flex-col"
              >
                {/* ───────────────── IMAGE ───────────────── */}
                <div
                  className="
    relative
    h-[210px]
    w-full
    overflow-hidden
    rounded-xl
  "
                >
                  {feature.image ? (
                    <>
                      {/* Image */}
                      <img
                        src={feature.image}
                        alt={`${feature.title} illustration`}
                        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          scale-[2]
          transition-transform
          duration-700
          group-hover:scale-[2.04]
        "
                      />

                      {/* Bottom transition into page */}
                      <div
                        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-24
          bg-gradient-to-t
          from-[hsl(var(--bg))]
          via-[hsl(var(--bg)/0.75)]
          to-transparent
        "
                      />

                      {/* Very subtle overall darkening */}
                      <div
                        className="
          pointer-events-none
          absolute
          inset-0
          bg-[hsl(var(--bg)/0.08)]
        "
                      />
                    </>
                  ) : (
                    <>
                      {/* Placeholder accent background */}
                      <div
                        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.14),transparent_68%)]
        "
                      />

                      {/* Minimal grid */}
                      <div
                        className="
          absolute
          inset-0
          opacity-[0.14]
        "
                        style={{
                          backgroundImage: `
            linear-gradient(
              to right,
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            )
          `,
                          backgroundSize: "40px 40px",
                        }}
                      />

                      {/* Placeholder icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-accent/20
            bg-accent/10
            transition-all
            duration-500
            group-hover:scale-105
            group-hover:bg-accent/15
          "
                        >
                          <Icon
                            className="h-7 w-7 text-accent"
                            strokeWidth={1.4}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* ───────────────── HEADING ───────────────── */}
                <h3
                  className="
                    mt-0
                    font-serif
                    text-[1.55rem]
                    font-normal
                    leading-[1.1]
                    tracking-[-0.025em]
                    text-[hsl(var(--text-primary))]
                    sm:text-[1.7rem]
                  "
                >
                  {titleParts[0]}

                  <span className="text-accent">{feature.highlight}</span>

                  {titleParts[1]}
                </h3>

                {/* ───────────────── DESCRIPTION ───────────────── */}
                <p
                  className="
                    mt-5
                    max-w-[390px]
                    text-[0.95rem]
                    font-normal
                    leading-[1.7]
                    text-[hsl(var(--text-secondary))]
                  "
                >
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
