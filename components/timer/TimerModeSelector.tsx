"use client";

import { useCaptureStore, TimerPresetId } from "@/store/captureStore";
import { TIMER_PRESETS } from "@/lib/timer/timerPresets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faClock } from "@fortawesome/free-solid-svg-icons";

export function TimerModeSelector() {
  const activeMode = useCaptureStore((s) => s.activeMode);
  const setActiveMode = useCaptureStore((s) => s.setActiveMode);
  const activeTimerPreset = useCaptureStore((s) => s.activeTimerPreset);
  const setActiveTimerPreset = useCaptureStore((s) => s.setActiveTimerPreset);
  const isTimerRunning = useCaptureStore((s) => s.isTimerRunning);

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Primary Mode Switcher (Icon-only buttons with tooltips & aria-labels) */}
      <div className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md shadow-lg">
        <button
          onClick={() => !isTimerRunning && setActiveMode("gaze")}
          disabled={isTimerRunning}
          title="Instant Mode"
          aria-label="Instant Mode"
          className={`relative p-2.5 rounded-lg transition-all ${
            activeMode === "gaze"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <FontAwesomeIcon icon={faCamera} className="w-4 h-4" />
        </button>

        <button
          onClick={() => !isTimerRunning && setActiveMode("timer")}
          disabled={isTimerRunning}
          title="Timer Mode"
          aria-label="Timer Mode"
          className={`relative p-2.5 rounded-lg transition-all ${
            activeMode === "timer"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
        </button>
      </div>

      {/* Timer Presets Sub-Selector (visible when Timer mode is active) */}
      {activeMode === "timer" && (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md shadow-lg">
          {(["3s", "10s", "5s"] as TimerPresetId[]).map((id) => {
            const preset = TIMER_PRESETS[id];
            const isSelected = activeTimerPreset === id;
            return (
              <button
                key={id}
                onClick={() => !isTimerRunning && setActiveTimerPreset(id)}
                disabled={isTimerRunning}
                title={preset.name}
                aria-label={preset.name}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-zinc-800 text-white border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                {preset.id}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
