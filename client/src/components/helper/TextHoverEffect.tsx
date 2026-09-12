import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TextHoverEffectProps {
  text: string;
  duration: number;
}

export const TextHoverEffect = ({
  text,
  duration,
}: TextHoverEffectProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({
    cx: "50%",
    cy: "50%",
  });

  const [fontSize, setFontSize] = useState(440);
  const [marginTop, setMarginTop] = useState(80);
  const [containerHeight, setContainerHeight] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setFontSize(380);
        setMarginTop(60);
        setContainerHeight(220);
      } else if (width < 640) {
        setFontSize(420);
        setMarginTop(70);
        setContainerHeight(240);
      } else if (width < 768) {
        setFontSize(460);
        setMarginTop(80);
        setContainerHeight(260);
      } else if (width < 1024) {
        setFontSize(480);
        setMarginTop(90);
        setContainerHeight(280);
      } else {
        setFontSize(500);
        setMarginTop(80);
        setContainerHeight(300);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();

    const cxPercentage =
      ((cursor.x - svgRect.left) / svgRect.width) * 100;

    const cyPercentage =
      ((cursor.y - svgRect.top) / svgRect.height) * 100;

    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    });
  }, [cursor]);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center overflow-hidden"
      style={{ height: `${containerHeight}px` }}
      onMouseMove={(e) =>
        setCursor({
          x: e.clientX,
          y: e.clientY,
        })
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 2500 400"
        width="100%"
        height="100%"
        className="pointer-events-none select-none"
        style={{
          display: "block",
          marginTop: `${marginTop}px`,
        }}
      >
        <defs>
          <linearGradient
            id="textGradient"
            gradientUnits="userSpaceOnUse"
            cx="50%"
            cy="50%"
            r="25%"
          >
            {hovered && (
              <>
                <stop offset="0%" stopColor="#D0FE1B" />
              </>
            )}
          </linearGradient>

          <motion.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r="20%"
            initial={{ cx: "50%", cy: "50%" }}
            animate={maskPosition}
            transition={{
              duration: duration ?? 0,
              ease: "easeOut",
            }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id="textMask">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#revealMask)"
            />
          </mask>
        </defs>

        <text
          x="50%"
          y="98%"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          strokeWidth="8"
          className="fill-transparent stroke-neutral-300 font-[helvetica] dark:stroke-neutral-400"
          style={{ opacity: 0.8 }}
        >
          {text}
        </text>

        <text
          x="50%"
          y="98%"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          strokeWidth={hovered ? "12" : "8"}
          className="fill-transparent stroke-neutral-200 font-[helvetica] dark:stroke-neutral-400"
          style={{ opacity: hovered ? 0.9 : 0.6 }}
        >
          {text}
        </text>

        <motion.text
          x="50%"
          y="98%"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          strokeWidth={hovered ? "12" : "8"}
          className="fill-transparent stroke-neutral-200 font-[helvetica] dark:stroke-neutral-400"
          initial={{
            strokeDashoffset: 1000,
            strokeDasharray: 1000,
          }}
          animate={{
            strokeDashoffset: 0,
            strokeDasharray: 1000,
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        <text
          x="50%"
          y="98%"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="900"
          stroke="url(#textGradient)"
          strokeWidth={hovered ? "12" : "8"}
          mask="url(#textMask)"
          className="fill-transparent font-[helvetica]"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};