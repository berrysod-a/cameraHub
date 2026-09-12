"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCaptureStore } from "@/store/captureStore";
import { TIMER_PRESETS } from "@/lib/timer/timerPresets";

interface CountdownDisplayProps {
  onComplete?: () => void;
}

export function CountdownDisplay({ onComplete }: CountdownDisplayProps) {
  const activeTimerPreset = useCaptureStore((s) => s.activeTimerPreset);
  const isTimerRunning = useCaptureStore((s) => s.isTimerRunning);
  const setIsTimerRunning = useCaptureStore((s) => s.setIsTimerRunning);
  const triggerCapture = useCaptureStore((s) => s.triggerCapture);
  const setShowRickrollOverlay = useCaptureStore((s) => s.setShowRickrollOverlay);

  const [currentLabel, setCurrentLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isTimerRunning) {
      setCurrentLabel(null);
      return;
    }

    const preset = TIMER_PRESETS[activeTimerPreset];
    const steps = preset.steps;
    let stepIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const playStep = () => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setCurrentLabel(step.label);

        timeoutId = setTimeout(() => {
          stepIndex++;
          playStep();
        }, step.durationMs);
      } else {
        // Countdown completed
        setCurrentLabel(null);
        setIsTimerRunning(false);

        if (preset.isRickroll) {
          setShowRickrollOverlay(true);
        } else {
          triggerCapture();
          if (onComplete) onComplete();
        }
      }
    };

    playStep();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isTimerRunning, activeTimerPreset, setIsTimerRunning, triggerCapture, setShowRickrollOverlay, onComplete]);

  if (!isTimerRunning || !currentLabel) return null;

  return (
    <div className="absolute top-4 right-4 z-30 pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLabel}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          {/* Direct text overlay with text shadow — no background box panel */}
          <span className="text-5xl md:text-7xl font-sans font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {currentLabel}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
