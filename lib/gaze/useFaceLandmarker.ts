"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export interface FaceDetectionResult {
  yaw: number;
  pitch: number;
  faceDetected: boolean;
}

// Install a one-time, permanent filter on console.error at module scope.
// MediaPipe's WASM runtime emits "INFO: ..." messages via console.error
// (e.g. "INFO: Created TensorFlow Lite XNNPACK delegate for CPU.")
// Turbopack's dev overlay intercepts console.error and shows these as
// red error banners. The filter below is safe: it only suppresses lines
// that start with "INFO:" — real errors still pass through.
if (typeof window !== "undefined") {
  const _orig = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("INFO:")) return;
    _orig(...args);
  };
}

export function useFaceLandmarker() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initFaceLandmarker() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        if (isMounted) {
          landmarkerRef.current = landmarker;
          setIsLoaded(true);
        }
      } catch (err: any) {
        console.warn("Failed to initialize FaceLandmarker:", err);
        if (isMounted) {
          setError(err.message || "Failed to initialize face detector");
        }
      }
    }

    initFaceLandmarker();

    return () => {
      isMounted = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, []);

  const lastTimestampRef = useRef<number>(0);

  const detectFrame = (
    videoElement: HTMLVideoElement,
    timestampMs: number
  ): FaceDetectionResult => {
    if (
      !landmarkerRef.current ||
      !videoElement ||
      videoElement.readyState < 2 ||
      videoElement.paused ||
      videoElement.ended ||
      videoElement.currentTime <= 0
    ) {
      return { yaw: 0, pitch: 0, faceDetected: false };
    }

    // Ensure timestamp is strictly increasing
    const validTimestamp = Math.max(timestampMs, lastTimestampRef.current + 1);
    lastTimestampRef.current = validTimestamp;

    try {
      const results = landmarkerRef.current.detectForVideo(videoElement, validTimestamp);

      if (
        results?.facialTransformationMatrixes?.length > 0
      ) {
        const matrix = results.facialTransformationMatrixes[0].data;
        return {
          yaw: (Math.atan2(matrix[2], matrix[10]) * 180) / Math.PI,
          pitch: (Math.atan2(-matrix[6], matrix[10]) * 180) / Math.PI,
          faceDetected: true,
        };
      }
    } catch {
      // Ignore transient frame errors
    }

    return { yaw: 0, pitch: 0, faceDetected: false };
  };

  return { isLoaded, error, detectFrame };
}
