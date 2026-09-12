"use client";

import { useCaptureStore } from "@/store/captureStore";

export function GazeIndicator() {
  const yaw = useCaptureStore((s) => s.yaw);
  const pitch = useCaptureStore((s) => s.pitch);
  const showDebugInfo = useCaptureStore((s) => s.showDebugInfo);

  if (!showDebugInfo) return null;

  return (
    <div className="flex items-center gap-4 text-[11px] font-mono bg-black/80 px-3 py-1 rounded-md border border-zinc-800 text-amber-300 shadow-inner select-none pointer-events-none">
      <span>Yaw: {yaw.toFixed(1)}°</span>
      <span>Pitch: {pitch.toFixed(1)}°</span>
    </div>
  );
}
