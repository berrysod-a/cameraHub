export interface TimerStep {
  label: string;
  durationMs: number;
}

export interface TimerPreset {
  id: "3s" | "10s" | "5s";
  name: string;
  description: string;
  steps: TimerStep[];
  isRickroll?: boolean;
  rickrollDurationMs?: number;
}

export const TIMER_PRESETS: Record<"3s" | "10s" | "5s", TimerPreset> = {
  "3s": {
    id: "3s",
    name: "3 Seconds",
    description: "Suspiciously long 3 seconds (~7s total)",
    steps: [
      { label: "3", durationMs: 4000 },
      { label: "2", durationMs: 2000 },
      { label: "1", durationMs: 1000 },
    ],
  },
  "10s": {
    id: "10s",
    name: "10 Seconds",
    description: "Rapid collapse after 8 (~4s total blitz)",
    steps: [
      { label: "10", durationMs: 1000 },
      { label: "9", durationMs: 1000 },
      { label: "8", durationMs: 1000 },
      { label: "7", durationMs: 143 },
      { label: "6", durationMs: 143 },
      { label: "5", durationMs: 143 },
      { label: "4", durationMs: 143 },
      { label: "3", durationMs: 143 },
      { label: "2", durationMs: 143 },
      { label: "1", durationMs: 142 },
    ],
  },
  "5s": {
    id: "5s",
    name: "5 Seconds",
    description: "Normal 5s countdown with reaction capture",
    steps: [
      { label: "5", durationMs: 1000 },
      { label: "4", durationMs: 1000 },
      { label: "3", durationMs: 1000 },
      { label: "2", durationMs: 1000 },
      { label: "1", durationMs: 1000 },
    ],
    isRickroll: true,
    rickrollDurationMs: 12000,
  },
};
