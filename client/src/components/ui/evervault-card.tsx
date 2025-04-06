"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const EvervaultCard = ({ text, className }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    let str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (

    <div className={cn("p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative", className)}>
      <div
        onMouseMove={onMouseMove}
        className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full">
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />

        {/* Make text always visible */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <div className="dark:text-white text-black z-20">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="100px" height="100px" viewBox="0 0 296.000000 291.000000" preserveAspectRatio="xMidYMid meet">
                <metadata>
                  Created by potrace 1.16, written by Peter Selinger 2001-2019
                </metadata>
                <g transform="translate(0.000000,291.000000) scale(0.100000,-0.100000)" fill="#fff" stroke="none">
                  <path d="M440 2592 l-154 -27 -28 -115 c-16 -63 -40 -165 -54 -226 l-25 -111 81 -151 81 -151 -10 -98 c-6 -54 -20 -182 -32 -284 l-22 -185 225 -405 c124 -222 235 -423 246 -446 23 -45 11 -39 217 -102 468 -143 566 -170 593 -161 15 5 167 50 337 100 171 50 328 97 350 104 45 14 10 -42 374 608 l172 307 -11 68 c-21 130 -58 486 -52 502 3 9 39 76 79 150 40 74 73 140 73 147 0 11 -18 90 -80 358 -10 43 -22 82 -27 86 -4 5 -66 18 -138 29 -71 12 -144 23 -160 26 -24 4 -55 -9 -155 -66 l-125 -71 -140 22 c-77 11 -214 32 -305 47 -205 32 -235 32 -440 0 -91 -15 -227 -36 -303 -47 l-137 -22 -124 71 c-68 39 -130 71 -138 70 -7 0 -83 -13 -168 -27z m262 -53 c138 -77 139 -78 127 -101 -19 -36 -38 -31 -126 32 l-87 63 -125 -14 -124 -14 -18 -80 c-10 -44 -27 -125 -37 -180 -23 -114 -27 -96 61 -254 l47 -84 -22 -34 c-13 -18 -25 -33 -28 -33 -7 0 -53 77 -115 193 l-47 87 50 206 c27 113 52 207 54 209 6 6 243 52 275 54 13 0 64 -22 115 -50z m1906 26 c75 -14 140 -29 143 -33 4 -4 14 -36 22 -72 40 -166 77 -329 77 -339 0 -20 -145 -280 -154 -278 -5 2 -19 16 -31 33 l-23 29 65 118 65 118 -36 176 c-19 96 -37 178 -40 181 -7 6 -178 31 -221 32 -21 0 -55 -18 -114 -60 -46 -33 -90 -60 -98 -60 -17 0 -42 52 -28 57 6 2 55 30 110 63 55 32 106 59 113 60 7 0 74 -11 150 -25z m-1090 -138 c3 -133 7 -128 -83 -103 -27 8 -144 39 -259 70 -200 54 -225 62 -215 69 2 2 90 16 194 32 105 15 224 33 265 40 41 7 80 12 85 10 6 -1 11 -51 13 -118z m242 89 c80 -13 189 -30 243 -37 53 -7 97 -16 97 -20 0 -5 -19 -13 -42 -19 -75 -19 -301 -80 -368 -100 -36 -10 -82 -22 -102 -25 l-38 -7 0 116 0 116 33 0 c17 0 97 -11 177 -24z m-1063 -77 c75 -55 83 -63 70 -78 -8 -9 -65 -81 -127 -161 -63 -80 -132 -168 -154 -197 -23 -28 -45 -51 -50 -49 -5 1 -33 45 -62 97 l-52 95 13 69 c32 161 53 256 57 260 4 5 140 22 186 24 27 1 52 -12 119 -60z m1937 42 l40 -6 33 -162 34 -163 -56 -105 -57 -105 -61 77 c-34 43 -95 121 -136 173 -41 52 -92 116 -113 142 l-38 47 87 60 88 61 70 -6 c39 -3 88 -9 109 -13z m-1549 -92 c105 -28 193 -54 197 -57 4 -4 -153 -168 -350 -365 l-357 -357 -85 96 c-47 52 -86 101 -88 108 -1 7 35 61 81 122 264 345 323 423 350 462 17 23 38 42 46 42 9 0 102 -23 206 -51z m1296 -191 c101 -134 207 -274 237 -312 52 -68 52 -69 34 -90 -10 -12 -49 -56 -86 -98 -38 -43 -74 -78 -80 -78 -17 0 -720 707 -709 713 5 3 54 17 108 31 55 14 138 37 185 50 47 14 95 25 106 25 17 1 64 -55 205 -241z m-925 91 l64 -20 -2 -315 -3 -315 -102 -41 c-56 -22 -108 -38 -116 -35 -12 5 -103 170 -229 417 l-28 55 143 143 c160 161 139 153 273 111z m423 -113 l144 -144 -98 -188 c-54 -104 -111 -212 -126 -240 l-29 -52 -78 30 c-42 17 -92 35 -110 42 l-32 11 2 320 3 320 80 22 c44 12 85 22 90 22 6 1 75 -64 154 -143z m-779 -322 c45 -85 80 -157 78 -160 -3 -2 -40 3 -84 11 -127 24 -120 28 -134 -67 -6 -46 -14 -90 -16 -99 -3 -11 15 -30 55 -57 32 -23 66 -45 75 -48 8 -3 47 9 86 27 39 17 72 30 75 27 4 -3 -102 -316 -111 -327 -8 -9 -354 22 -363 33 -15 19 -161 368 -161 385 0 12 405 431 417 431 1 0 38 -70 83 -156z m1297 -445 c-41 -96 -80 -186 -87 -200 -12 -26 -13 -27 -186 -39 -96 -7 -178 -10 -182 -6 -12 13 -120 321 -112 324 3 1 36 -11 73 -28 37 -16 71 -30 76 -30 11 0 129 78 136 90 5 8 -6 101 -21 173 -7 32 -16 33 -126 11 -44 -9 -81 -14 -84 -12 -2 3 19 47 46 99 27 52 64 122 82 156 l33 63 213 -213 213 -213 -74 -175z m-1928 276 c91 -104 93 -108 177 -302 46 -108 84 -204 84 -213 0 -9 -9 -34 -20 -55 -11 -22 -46 -94 -76 -160 -31 -66 -61 -126 -67 -133 -13 -16 -25 3 -161 250 l-98 177 17 163 c9 90 23 208 31 263 7 55 14 103 14 108 0 14 8 6 99 -98z m2255 -153 c14 -127 26 -246 26 -263 0 -20 -26 -78 -73 -163 -41 -72 -96 -171 -123 -219 l-49 -88 -72 148 c-40 81 -79 166 -88 188 l-16 41 76 179 c42 99 85 195 95 213 33 55 184 220 192 208 3 -6 18 -116 32 -244z m-1209 -168 l0 -229 -50 -3 -50 -3 -23 78 c-56 194 -82 289 -82 304 0 12 27 27 93 52 50 19 97 34 102 33 6 -2 10 -87 10 -232z m152 194 c46 -16 85 -33 87 -37 5 -7 -15 -79 -81 -303 l-26 -88 -49 0 -48 0 0 236 c0 221 1 236 18 229 9 -4 54 -20 99 -37z m-358 -163 c12 -44 34 -124 50 -178 l28 -98 -65 -58 -65 -59 11 -82 c7 -46 13 -84 14 -85 9 -5 224 -192 231 -200 4 -5 6 -23 5 -40 -3 -30 -4 -30 -74 -35 -54 -4 -80 -11 -110 -31 -52 -35 -113 -69 -123 -69 -5 0 -50 70 -101 155 l-92 154 57 163 c32 90 71 201 88 248 16 47 40 114 52 150 48 140 58 161 65 153 5 -4 18 -44 29 -88z m609 -266 c67 -190 122 -352 122 -360 -1 -18 -175 -302 -188 -307 -6 -2 -48 20 -94 47 -77 47 -90 51 -146 51 l-62 0 0 39 c0 41 -12 29 202 212 25 21 32 38 44 105 l14 79 -67 61 -67 61 43 154 c58 209 62 222 71 212 4 -4 62 -164 128 -354z m-938 8 c100 -10 125 -15 123 -27 0 -8 -27 -90 -59 -181 l-58 -165 103 -171 102 -171 145 -122 c79 -68 143 -124 141 -126 -3 -4 -80 19 -437 125 l-245 74 -105 189 c-58 105 -106 194 -108 199 -4 9 147 336 172 374 13 19 22 22 58 18 24 -3 99 -10 168 -16z m1415 -177 l91 -195 -67 -120 c-36 -67 -86 -156 -110 -197 l-44 -76 -100 -31 c-55 -17 -185 -56 -290 -87 -104 -30 -210 -62 -234 -70 -25 -7 -47 -11 -50 -8 -3 3 12 20 34 37 22 18 87 73 145 123 93 81 112 103 170 200 36 60 81 135 101 167 l37 57 -40 113 c-44 125 -77 227 -78 242 0 8 304 45 334 40 5 0 50 -88 101 -195z m-1030 -510 c24 -25 36 -30 89 -32 l61 -3 3 -107 c2 -75 -1 -108 -9 -108 -13 0 -269 218 -269 229 0 9 71 50 86 51 5 0 23 -13 39 -30z m427 4 c41 -26 41 -27 21 -43 -12 -9 -73 -60 -136 -113 -63 -54 -118 -98 -121 -98 -3 0 -6 50 -6 110 l0 110 58 0 c52 0 62 3 87 30 35 37 44 37 97 4z" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] opacity-50"></div>
      <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 backdrop-blur-xl transition duration-500" style={style} />
      <motion.div className="absolute inset-0 rounded-2xl mix-blend-overlay" style={style}>
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
