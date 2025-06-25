import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import createGlobe from "cobe";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

// Components
import { EvervaultCard } from "./evervault-card"

// Assets
import Code from "../../assets/FeatureHero/yt-thumbnail.jpeg";


export function FeaturesSection() {
  const features = [
    {
      title: "Track issues effectively",
      description: "Track and manage your project issues with ease using our intuitive interface.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Gorr",
      description: "Your all-in-one solution for seamless hosting.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Watch on YouTube",
      description: "You can get to know about our product on YouTube",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Deploy in seconds",
      description: "With our blazing fast cloud services, you can deploy your website in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <>
      <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto bg-black" id="about">
        <div className="px-8">
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Effortless hosting with limitless possibilities!
          </h4>
          <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            Deploy, scale, and manage your applications seamlessly with our powerful infrastructure and developer-friendly tools.
          </p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
            {features.map((feature) => (
              <FeatureCard key={feature.title} className={feature.className}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div className="h-full w-full">{feature.skeleton}</div>
              </FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const FeatureCard = ({ children, className }) => (
  <div className={cn("p-4 sm:p-8 relative overflow-hidden", className)}>
    {children}
  </div>
);

const FeatureTitle = ({ children }) => (
  <p className="text-xl md:text-2xl text-black text-white">
    {children}
  </p>
);

const FeatureDescription = ({ children }) => (
  <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-300">
    {children}
  </p>
);

export const SkeletonOne = () => (
  <div className="relative flex h-full">
    <img
      src={Code}
      alt="header"
      className="h-full w-full object-contain rounded-sm"
    />

    {/* Overlay with shadows on all sides */}
    <div className="absolute inset-0 pointer-events-none bg-transparent shadow-[inset_30px_0px_60px_-12px_black,inset_-30px_0px_60px_-12px_black,inset_0px_30px_60px_-12px_black,inset_0px_-30px_60px_-12px_black]"></div>
  </div>
);



export const SkeletonThree = () => (
  <a href="https://www.youtube.com/watch?v=kSnP80ctjlw" target="_blank" className=" relative flex gap-10 h-full group/image">
    <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
    <img src={Code} alt="header" className="h-full w-full object-cover rounded-sm transition-all duration-200" />
  </a>
);

export const SkeletonTwo = () => {
  return (
    <div className="">
      <EvervaultCard text="GORR" className="w-full h-full" />
    </div>
  );
};

export const SkeletonFour = () => (
  <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
    <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
  </div>
);

export const Globe = ({ className }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });
    return () => {
      globe.destroy();
    };
  }, []);
  return <canvas ref={canvasRef} style={{ width: 600, height: 600 }} className={className} />;
};
