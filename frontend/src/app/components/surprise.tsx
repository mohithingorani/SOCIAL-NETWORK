"use client";
import { useRef, useState } from "react";

export default function ReminderModal() {
  const [showSmile, setShowSmile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSmile = () => {
    setShowSmile(true);
    audioRef.current?.play();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl relative mx-4 animate-fade-in">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
        >
          ×
        </button>

        <div className="text-3xl font-extrabold mb-3 text-pink-600">
          {showSmile ? "jaa nahi dikha rha" : "hey, i heard you named me wavy mavy!"}
        </div>

        {!showSmile ? (
          <>
            <div className="text-md mb-4 text-gray-600 dark:text-gray-300">
              not the best name... but guess what? this careless guy actually cares
              about you
            </div>
            <button
              onClick={handleSmile}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg transition transform hover:scale-105"
            >
              Wanna see magic?
            </button>
          </>
        ) : (
          <div className="relative flex flex-col items-center space-y-4">
            <div className="relative h-32 overflow-hidden w-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute animate-float-down"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${-10 + Math.random() * 20}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                    fontSize: `${Math.random() * 1.5 + 1}rem`,
                  }}
                >
                  <img src="/frog.png" alt="frog" width={60} />
                </span>
              ))}
            </div>
          </div>
        )}

        <audio ref={audioRef} src="/rickroll.mp3" preload="auto" />
      </div>
    </div>
  );
}
