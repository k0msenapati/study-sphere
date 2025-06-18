'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const StudyArea = () => {
  const [time, setTime] = useState(new Date());
  const [selectedSound, setSelectedSound] = useState('/sounds/lofi.mp3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [customTime, setCustomTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Music change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = selectedSound;
      if (isPlaying) audioRef.current.play();
    }
  }, [selectedSound]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const exitStudyMode = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.push('/dashboard');
  };

  // Start Timer
  const startTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    let seconds = customTime * 60;
    setRemainingTime(seconds);

    timerIntervalRef.current = setInterval(() => {
      seconds--;
      setRemainingTime(seconds);
      if (seconds <= 0 && timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        setRemainingTime(null);
      }
    }, 1000);
  };

  // Reset Timer
  const resetTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setRemainingTime(null);
    setCustomTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background GIF */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <img
          src="/studyGIF.gif"
          alt="study mode"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-between p-4 text-white">

        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={exitStudyMode}
            className="bg-black text-white px-4 py-2 rounded shadow"
          >
            Exit Study Mode
          </button>

          <div className="flex gap-4 items-center bg-black text-white px-3 py-1 rounded shadow">
            <select
              className="bg-black outline-none"
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value)}
            >
              <option value="/sounds/rain.mp3">Rain Sounds</option>
              <option value="/sounds/forest.mp3">Forest</option>
              <option value="/sounds/cafe.mp3">Coffee Shop</option>
              <option value="/sounds/lofi.mp3">Lo-Fi Beats</option>
              <option value="/sounds/river.mp3">River Stream</option>
            </select>
            <button onClick={toggleMusic} className="font-semibold">
              {isPlaying ? 'Pause Music' : 'Play Music'}
            </button>
          </div>
        </div>

      {/* Clock or Timer */}
      <div className="flex flex-col items-center justify-center text-[#12254783] font-bold text-shadow-lg flex-1 gap-6">
        <div className="text-5xl">
          {remainingTime !== null
            ? formatTime(remainingTime)
            : time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(parseInt(e.target.value))}
            className="text-black px-2 py-1 rounded w-28"
            placeholder="Minutes"
          />
          <button
            onClick={startTimer}
            className="bg-[#4CAF90] hover:bg-[#45a582] text-white px-3 py-1 rounded transition-all duration-200"
          >
            Start Timer
          </button>
          <button
            onClick={resetTimer}
            className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-3 py-1 rounded transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      </div>

      <audio ref={audioRef} loop />
    </div>
  );
};

export default StudyArea;
