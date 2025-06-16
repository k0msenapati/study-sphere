"use client";

import { useState, useEffect } from "react";

export default function StudyArea() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes > 0) {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const handleStart = () => {
    if (minutes === 0 && seconds === 0) return;
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-pink-700">
        🧠 Study Area
      </h1>

      <div className="bg-white p-10 rounded-lg shadow-md text-center">
        <div className="text-5xl font-bold text-pink-600 mb-6">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        <div className="mb-4 space-x-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minutes}
            disabled={isRunning}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 rounded border border-pink-300 text-center"
          />
          <input
            type="number"
            min={0}
            placeholder="Sec"
            value={seconds}
            disabled={isRunning}
            onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 rounded border border-pink-300 text-center"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Start
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
