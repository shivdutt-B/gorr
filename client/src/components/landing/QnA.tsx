import React, { useState } from "react";

const faqs = [
  {
    question: "What is GORR and how does it work?",
    answer:
      "GORR is a microservices-based deployment platform that automates the entire pipeline from code push to production. Connect your GitHub repository, and GORR handles building, containerizing, and deploying your application to scalable cloud infrastructure with real-time monitoring.",
  },
  {
    question: "Which frameworks and languages are supported?",
    answer:
      "GORR supports all major frontend and backend frameworks including React, Vue, Angular, Svelte, Astro, Node.js, Python, Go, and more. As long as your project has a build step or a static output, GORR can deploy it.",
  },
  {
    question: "How does real-time logging work?",
    answer:
      "We use Redis Pub/Sub combined with Socket.IO to stream build and deployment logs directly to your dashboard. Every command, error, and success message is pushed in real-time so you never lose visibility into your deployment status.",
  },
  {
    question: "Can I use a custom domain for my deployments?",
    answer:
      "Yes. GORR supports custom domains and auto-provisions SSL certificates. Simply add your domain in the project settings, update your DNS records, and your application will be live on your own domain within minutes.",
  },
];

export function QnASection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayedIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-8 sm:py-12">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 50% at 30% 50%,
              hsl(var(--accent) / 0.015) 0%,
              transparent 70%
            )
          `,
        }}
      />

      <div className="container-gutter relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <h2
            className="
              font-serif
              text-[clamp(2rem,4vw,3.5rem)]
              font-normal
              leading-[1.08]
              tracking-[-0.025em]
              text-[hsl(var(--text-primary))]
            "
          >
            Questions? <span className="text-accent">We've got answers.</span>
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
            Everything you need to know about deploying with GORR.
          </p>
        </div>

        {/* Q&A Grid */}
        <div className="mt-12 grid gap-16 lg:mt-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Questions */}
          <div className="flex flex-col">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    group
                    relative
                    w-full
                    border-b
                    border-[hsl(var(--border)/0.15)]
                    py-6
                    text-left
                    transition-colors
                    duration-300
                    ${isActive
                      ? "text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
                    }
                  `}
                >
                  <span
                    className="
                      font-serif
                      text-[clamp(1.3rem,2.2vw,1.75rem)]
                      font-normal
                      leading-[1.2]
                      tracking-[-0.01em]
                    "
                  >
                    {faq.question}
                  </span>

                  {/* Bottom accent line on active */}
                  <span
                    className={`
                      absolute
                      bottom-[-1px]
                      left-0
                      h-[1px]
                      bg-[hsl(var(--accent))]
                      transition-all
                      duration-500
                      ease-out
                      ${isActive ? "w-full" : "w-0"}
                    `}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Answer — no box, just text */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span
              className="
                text-[0.7rem]
                font-medium
                uppercase
                tracking-[0.15em]
                text-[hsl(var(--text-muted))]
              "
            >
              Answer
            </span>

            <p
              className="
                mt-5
                text-[1.5rem]
                leading-[1.75]
                text-[hsl(var(--text-secondary))]
                transition-opacity
                duration-200
              "
              key={displayedIndex}
            >
              {faqs[displayedIndex].answer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}