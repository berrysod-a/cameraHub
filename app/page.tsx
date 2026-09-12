"use client";

import { CameraView } from "@/components/camera/CameraView";
import { TimerModeSelector } from "@/components/timer/TimerModeSelector";
import { useCaptureStore } from "@/store/captureStore";

export default function Home() {
  const setIsTimerRunning = useCaptureStore((s) => s.setIsTimerRunning);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-7xl mx-auto px-4 py-4 md:py-6 gap-4 flex-1">
      {/* Top Chrome Controls (Icon-Primary Mode Switcher) */}
      <div className="flex items-center justify-center w-full">
        <TimerModeSelector />
      </div>

      {/* Dominant Main Camera Studio Viewfinder */}
      <CameraView onStartTimer={handleStartTimer} />
    </div>
  );
}
