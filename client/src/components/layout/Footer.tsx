import { TextHoverEffect } from "../helper/TextHoverEffect";

const Footer = () => {
  return (
    <footer
      className="
        relative
        w-full
        overflow-hidden
        bg-[hsl(var(--bg))]
        pt-10
        pb-10
      "
    >
      {/* ───────────────────── BACKGROUND GLOW ───────────────────── */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[500px]
          opacity-40
        "
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 55%, hsl(var(--accent) / 0.07), transparent 75%)",
        }}
      />

      {/* Smooth top transition */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-32
        "
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--bg)), transparent)",
        }}
      />

      <div className="relative z-10">
        {/* ───────────────────── LARGE LOGO ───────────────────── */}
        <div className="relative overflow-hidden">
          <TextHoverEffect text="GORR" duration={0} />
        </div>

        {/* ───────────────────── SOCIAL LINKS ───────────────────── */}
        <div className="mt-5 flex items-center justify-center gap-7">
          <a
            href="https://github.com/shivdutt-B"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-sm
              text-white/35
              transition-colors
              duration-300
              hover:text-accent
            "
          >
            GitHub ↗
          </a>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <a
            href="https://www.linkedin.com/in/shivdutt-bhadakwad-07a462280/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-sm
              text-white/35
              transition-colors
              duration-300
              hover:text-accent
            "
          >
            LinkedIn ↗
          </a>

          <span className="h-1 w-1 rounded-full bg-white/15" />

          <a
            href="https://shivdutt.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-sm
              text-white/35
              transition-colors
              duration-300
              hover:text-accent
            "
          >
            Portfolio ↗
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;