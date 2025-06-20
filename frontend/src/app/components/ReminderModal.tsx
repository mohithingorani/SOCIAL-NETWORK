"use client";
import { useRef, useState } from "react";

export default function ReminderModal() {
  const [showHug, setShowHug] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleHug = () => {
    setShowHug(true);
    audioRef.current?.play();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md text-center shadow-2xl relative mx-4">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold transition"
        >
          ×
        </button>

        <div className="text-xl font-semibold mb-2 text-pink-600">
          hey i heard you named me wavy mavy !!
        </div>
        <div className="text-sm mb-4 text-gray-500 dark:text-gray-300">
          well you could have thought something better
        </div>
        <div className="text-base font-medium mb-6 text-green-600 dark:text-green-400">
          You’re doing amazing, even if it doesn’t feel like it today 💪
        </div>

        {!showHug ? (
          <button
            onClick={handleHug}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition"
          >
            Need a Hug?
          </button>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <img
              src="/eggnew2.png"
              alt="hug"
              className="w-32 h-auto rounded-lg"
            />
            <div className="text-lg text-purple-600 dark:text-purple-300 font-semibold">
              This little chick believes in you 🐥 (and so do I)
            </div>
          </div>
        )}

        <audio ref={audioRef} src="/rickroll.mp3" preload="auto" />
      </div>
    </div>
  );
}
