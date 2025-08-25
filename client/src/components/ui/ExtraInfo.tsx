import React from "react";

import FridayRelease from "../../assets/FeatureHero/friday_release.png";
import { AnimatedBeam } from "./AnimatedBeam";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

// Assets
import Code from "../../assets/FeatureHero/yt-thumbnail.jpeg";

function ExtraInfo() {
  const SkeletonThree = () => (
    <a
      href="https://www.youtube.com/watch?v=kSnP80ctjlw"
      target="_blank"
      className=" relative flex gap-10 h-full group/image"
    >
      <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
      <img
        src={Code}
        alt="header"
        className="h-full w-full object-contain rounded-sm transition-all duration-200"
      />
    </a>
  );
  return (
    <>
      <section className="bg-black">
        <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full">
            {/* <div className="friday-release-container col-span-2 bg-green sm:col-span-2 md:col-span-2 h-auto md:h-full flex flex-col rounded-lg overflow-hidden">
              <div className="p-4 bg-black/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 30 30"
                    className="fill-gray-400"
                  >
                    <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
                  </svg>
                  <p className="text-gray-400 text-sm">
                    Roll back to successful version
                  </p>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white mt-2">
                  Friday Release
                </h3>
              </div>

              <div className="relative flex-grow overflow-hidden">
                <img
                  src={FridayRelease}
                  alt="Friday Release"
                  className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-b-lg"
                />
              </div>
            </div> */}
            <div className="friday-release-container col-span-2 bg-green sm:col-span-2 md:col-span-2 h-auto md:h-full flex flex-col rounded-lg overflow-hidden">
                <div className="p-4 bg-black/50 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm">
                    Here is a quick video to help you get started with Gorr.
                  </p>
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-white mt-2">
                  Watch tutorial to get started.
                </h3>
              </div>
            <SkeletonThree />

            </div>

            <div className="integrate-snippet-container col-span-2 sm:col-span-2 md:col-span-2 bg-black rounded-lg overflow-hidden">
              <AnimatedBeam />
              <div className="snippit-container grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono w-full max-w-lg mx-auto">
                  {/* Traffic Lights */}
                  <div className="flex space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Terminal Content */}
                  <div className="snippit-content-container text-xs leading-relaxed">
                    <p className="text-gray-400">
                      ▲ ~ gorr-site/{" "}
                      <span className="text-white">git push</span>
                    </p>
                    <p>Enumerating objects: 1, done.</p>
                    <p>Counting objects: 100% (1/1), done.</p>
                    <p>Writing objects: 100% (1/1), 72 bytes, done.</p>
                    <p>Total 1 (delta 0), reused 0 (delta 0).</p>
                    <p>To github.com:gorr/gorr-site.git</p>
                    <p className="text-green-400">
                      21326a9..81663c3 main -&gt; main
                    </p>
                  </div>
                </div>

                <div className="hidden mid:block border-green-100 p-1 w-4"></div>

                <div className="bg-[#123524] text-gray-100 p-4 rounded-lg font-mono w-full max-w-lg mx-auto">
                  <div className="flex space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="text-xs leading-relaxed snippit-content-container">
                    <p className="text-gray-400">
                      ▲ ~ gorr-site/{" "}
                      <span className="text-white">npm run build</span>
                    </p>
                    <p>Creating an optimized production build...</p>
                    <p>
                      Compiled successfully in{" "}
                      <span className="text-green-400">12.8s</span>!
                    </p>
                    <p>Files emitted:</p>
                    <p className="text-blue-400">
                      - /static/js/main.3f2a1b.chunk.js
                    </p>
                    <p className="text-blue-400">
                      - /static/css/main.2d4b9c.chunk.css
                    </p>
                    <p className="text-gray-400">
                      ▲ ~ gorr-site/{" "}
                      <span className="text-white">gorr deploy</span>
                    </p>
                    <p>Deploying to gorr...</p>
                    <p className="text-green-400">
                      Success! Project deployed to:
                    </p>
                    <p className="text-blue-300 underline">
                      https://gorr-site.gorr.app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ExtraInfo;
