"use client";

import { useEffect } from "react";
import { useCaptureStore } from "@/store/captureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faClock } from "@fortawesome/free-solid-svg-icons";

interface ShutterButtonProps {
  onStartTimer?: () => void;
}

export function ShutterButton({ onStartTimer }: ShutterButtonProps) {
  const activeMode = useCaptureStore((s) => s.activeMode);
  const captureState = useCaptureStore((s) => s.captureState);
  const armShutter = useCaptureStore((s) => s.armShutter);
  const disarmShutter = useCaptureStore((s) => s.disarmShutter);
  const isTimerRunning = useCaptureStore((s) => s.isTimerRunning);

  // Esc key listener to disarm shutter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (captureState === "ARMED" || captureState === "ARMED_WAITING") {
          disarmShutter();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [captureState, disarmShutter]);

  const isArmed = captureState === "ARMED" || captureState === "ARMED_WAITING";

  const handleClick = () => {
    if (activeMode === "timer") {
      if (onStartTimer && !isTimerRunning) {
        onStartTimer();
      }
      return;
    }

    if (isArmed) {
      disarmShutter();
    } else {
      armShutter();
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleClick}
        disabled={isTimerRunning}
        aria-label={isArmed ? "Cancel Capture" : "Capture Photo"}
        className={`group relative flex items-center justify-center gap-2.5 px-7 py-3 rounded-full font-medium text-sm transition-all duration-200 shadow-lg select-none ${
          isTimerRunning
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700 opacity-60"
            : isArmed
            ? "bg-zinc-100 text-zinc-950 hover:bg-white ring-4 ring-zinc-700/50 shadow-zinc-900 animate-pulse"
            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-black/80 hover:border-zinc-500"
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center text-zinc-300">
          {activeMode === "timer" ? (
            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
          ) : (
            <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
          )}
        </div>

        <span>
          {activeMode === "timer"
            ? isTimerRunning
              ? "Running..."
              : "Capture"
            : isArmed
            ? "Ready"
            : "Capture"}
        </span>
      </button>
    </div>
  );
}
