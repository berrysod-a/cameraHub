"use client";

import { useEffect, useRef } from "react";
import { useFaceLandmarker, FaceDetectionResult } from "./useFaceLandmarker";
import { useCaptureStore, GazeStatus } from "@/store/captureStore";

const DEBOUNCE_MS = 400; // ~400ms grace period to prevent flickering

export function useGazeState(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { isLoaded, error, detectFrame } = useFaceLandmarker();

  const pendingStatusRef = useRef<GazeStatus>("none");
  const currentStatusRef = useRef<GazeStatus>("none");
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    let animFrameId: number;

    const loop = (timestamp: number) => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const result: FaceDetectionResult = detectFrame(video, timestamp);
        const store = useCaptureStore.getState();

        if (result.faceDetected) {
          store.setHeadPose(result.yaw, result.pitch);
          const isLooking = Math.abs(result.yaw) < 15 && Math.abs(result.pitch) < 12;
          const rawStatus: GazeStatus = isLooking ? "looking" : "away";

          if (rawStatus !== pendingStatusRef.current) {
            pendingStatusRef.current = rawStatus;
            if (statusTimerRef.current) clearTimeout(statusTimerRef.current);

            statusTimerRef.current = setTimeout(() => {
              currentStatusRef.current = rawStatus;
              useCaptureStore.getState().handleGazeChange(rawStatus);
            }, DEBOUNCE_MS);
          }
        } else {
          store.setHeadPose(0, 0);
          if (pendingStatusRef.current !== "none") {
            pendingStatusRef.current = "none";
            if (statusTimerRef.current) clearTimeout(statusTimerRef.current);

            statusTimerRef.current = setTimeout(() => {
              currentStatusRef.current = "none";
              useCaptureStore.getState().handleGazeChange("none");
            }, DEBOUNCE_MS);
          }
        }
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, [isLoaded, detectFrame, videoRef]);

  return { isLoaded, error };
}
