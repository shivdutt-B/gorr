import React from "react";
import { AnimatedBeam } from "./AnimatedBeam";

function ExtraInfo() {
  return (
    <section className="bg-black">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-12 lg:px-6">
        <div className="bg-black rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center lg:items-start gap-6">
          
          {/* Beam takes more space */}
          <div className="flex-1 lg:flex-[0.7] w-full">
            <AnimatedBeam />
          </div>

          {/* Snippets take smaller space */}
          <div className="flex-1 lg:flex-[0.3] w-full grid grid-cols-1 gap-6">
            
            {/* Git Push Terminal */}
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono overflow-x-auto">
              <div className="flex space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed space-y-1">
                <p className="text-gray-400">
                  ▲ ~ gorr-site/ <span className="text-white">git push</span>
                </p>
                <p>Enumerating objects: 1, done.</p>
                <p>Counting objects: 100% (1/1), done.</p>
                <p>Writing objects: 100% (1/1), 72 bytes, done.</p>
                <p>Total 1 (delta 0), reused 0 (delta 0).</p>
                <p>To github.com:gorr/gorr-site.git</p>
                <p className="text-green-400">21326a9..81663c3 main -&gt; main</p>
              </div>
            </div>

            {/* Build + Deploy Terminal */}
            <div className="bg-[#123524] text-gray-100 p-4 rounded-lg font-mono overflow-x-auto">
              <div className="flex space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed space-y-1">
                <p className="text-gray-400">
                  ▲ ~ gorr-site/ <span className="text-white">npm run build</span>
                </p>
                <p>Creating an optimized production build...</p>
                <p>
                  Compiled successfully in{" "}
                  <span className="text-green-400">12.8s</span>!
                </p>
                <p>Files emitted:</p>
                <p className="text-blue-400">- /static/js/main.3f2a1b.chunk.js</p>
                <p className="text-blue-400">- /static/css/main.2d4b9c.chunk.css</p>
                <p className="text-gray-400">
                  ▲ ~ gorr-site/ <span className="text-white">gorr deploy</span>
                </p>
                <p>Deploying to gorr...</p>
                <p className="text-green-400">Success! Project deployed to:</p>
                <p className="text-blue-300 underline break-words">
                  https://gorr-site.gorr.app
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ExtraInfo;
