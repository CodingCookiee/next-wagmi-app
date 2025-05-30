"use client";
import React, { useEffect, useState } from "react";
import * as Progress from "@radix-ui/react-progress";

const PERCENTAGE = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const LABELS = [
  "Initializing awesomeness...",
  "Compiling brilliance",
  "Encrypting experience",
  "Connecting to the matrix",
  "Launch sequence initiated",
];

export default function PageLoading({ skipToEnd = false }) {
  const [index, setIndex] = useState(skipToEnd ? PERCENTAGE.length - 1 : 0);
  const [progress, setProgress] = useState(skipToEnd ? 100 : 0);
  const [completed, setCompleted] = useState(skipToEnd); // Track completion state

  useEffect(() => {
    // If we're skipping to the end, ensure we show 100% progress and the final label
    if (skipToEnd) {
      setProgress(100);
      setIndex(PERCENTAGE.length - 1);
      setCompleted(true);
      return;
    }

    let timer;
    const updateProgress = () => {
      setProgress(PERCENTAGE[index]);

      if (index < PERCENTAGE.length - 1) {
        setIndex(index + 1);
      } else {
        clearInterval(timer);
        setCompleted(true);
      }
    };

    timer = setInterval(updateProgress, 500); 
    return () => clearInterval(timer);
  }, [index, skipToEnd]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-2.5 sm:space-y-3 md:space-y-4 lg:space-y-5 bg-[-var(--background)] px-4 sm:px-6 md:px-8">
      <h2 className="text-xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl text-center font-audiowide 
      font-semibold text-[-var(--text)] transition-all duration-200 ease-in-out">
        {LABELS[Math.min(Math.floor(index / 2.5), LABELS.length - 1)]}
      </h2>
 
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-1 sm:space-y-1.5 transition-all duration-100 ease-in-out">
        <Progress.Root
          className="relative overflow-hidden bg-gray-300 rounded-xl w-full h-3 sm:h-4 md:h-5 lg:h-6"
          value={progress}
        >
          <Progress.Indicator
            className="w-full h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${100 - progress}%)`,
              backgroundColor: "#e87731",
            }}
          />
        </Progress.Root>

        <div className="flex justify-end mt-1">
          <span className="text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl font-nunito text-[-var(--text)] transition-all duration-200 ease-in-out">{progress}%</span>
        </div>
      </div>
    </div>
  );
}