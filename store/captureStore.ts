import { create } from "zustand";

export type CaptureState =
  | "IDLE"
  | "ARMED"
  | "ARMED_WAITING"
  | "CAPTURING"
  | "CAPTURED";

export type GazeStatus = "looking" | "away" | "none";
export type ModeType = "gaze" | "timer";
export type TimerPresetId = "3s" | "10s" | "5s";

interface CaptureStore {
  // Mode selection
  activeMode: ModeType;
  setActiveMode: (mode: ModeType) => void;

  // Gaze state machine
  captureState: CaptureState;
  setCaptureState: (state: CaptureState) => void;

  // Live Gaze Status
  gazeStatus: GazeStatus;
  setGazeStatus: (status: GazeStatus) => void;
  yaw: number;
  pitch: number;
  setHeadPose: (yaw: number, pitch: number) => void;

  // Timer mode state
  activeTimerPreset: TimerPresetId;
  setActiveTimerPreset: (preset: TimerPresetId) => void;
  timerDigit: string | number | null;
  setTimerDigit: (digit: string | number | null) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;

  // Rickroll overlay state
  showRickrollOverlay: boolean;
  setShowRickrollOverlay: (show: boolean) => void;

  // Debug & UI controls
  showDebugInfo: boolean;
  toggleDebugInfo: () => void;

  // Action methods
  armShutter: () => void;
  disarmShutter: () => void;
  triggerCapture: () => void;
  resetCapture: () => void;
  handleGazeChange: (newGaze: GazeStatus) => void;
}

export const useCaptureStore = create<CaptureStore>((set, get) => ({
  activeMode: "gaze",
  setActiveMode: (mode) => set({ activeMode: mode }),

  captureState: "IDLE",
  setCaptureState: (state) => set({ captureState: state }),

  gazeStatus: "none",
  setGazeStatus: (status) => set({ gazeStatus: status }),
  yaw: 0,
  pitch: 0,
  setHeadPose: (yaw, pitch) => set({ yaw, pitch }),

  activeTimerPreset: "3s",
  setActiveTimerPreset: (preset) => set({ activeTimerPreset: preset }),
  timerDigit: null,
  setTimerDigit: (digit) => set({ timerDigit: digit }),
  isTimerRunning: false,
  setIsTimerRunning: (running) => set({ isTimerRunning: running }),

  showRickrollOverlay: false,
  setShowRickrollOverlay: (show) => set({ showRickrollOverlay: show }),

  showDebugInfo: false,
  toggleDebugInfo: () => set((state) => ({ showDebugInfo: !state.showDebugInfo })),

  armShutter: () => {
    const { captureState, gazeStatus } = get();
    if (captureState === "IDLE") {
      if (gazeStatus === "looking") {
        set({ captureState: "ARMED_WAITING" });
      } else if (gazeStatus === "away") {
        set({ captureState: "CAPTURING" });
      } else {
        set({ captureState: "ARMED" });
      }
    } else if (captureState === "ARMED" || captureState === "ARMED_WAITING") {
      // Toggle off / cancel if clicked again
      set({ captureState: "IDLE" });
    }
  },

  disarmShutter: () => set({ captureState: "IDLE" }),

  triggerCapture: () => set({ captureState: "CAPTURING" }),

  resetCapture: () => set({ captureState: "IDLE" }),

  handleGazeChange: (newGaze: GazeStatus) => {
    const { captureState, activeMode } = get();
    set({ gazeStatus: newGaze });

    if (activeMode !== "gaze") return;

    if (captureState === "ARMED") {
      if (newGaze === "looking") {
        set({ captureState: "ARMED_WAITING" });
      } else if (newGaze === "away") {
        set({ captureState: "CAPTURING" });
      }
    } else if (captureState === "ARMED_WAITING") {
      if (newGaze === "away") {
        set({ captureState: "CAPTURING" });
      }
    }
  },
}));
