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
        console.warn("Failed to initialize CPU FaceLandmarker:", err);
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

    // Ensure timestampMs is strictly greater than previous timestamp
    let validTimestamp = Math.max(timestampMs, lastTimestampRef.current + 1);
    lastTimestampRef.current = validTimestamp;

    // Suppress MediaPipe's internal "INFO:" logs — the library calls console.error
    // for informational messages (e.g. TFLite XNNPACK delegate) which Turbopack
    // incorrectly surfaces as red dev-overlay errors.
    const _origError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].startsWith("INFO:")) return;
      _origError.apply(console, args);
    };

    let results: ReturnType<typeof landmarkerRef.current.detectForVideo> | null = null;
    try {
      results = landmarkerRef.current.detectForVideo(videoElement, validTimestamp);
    } catch (_) {
      // Ignore transient detection frames quietly
    } finally {
      console.error = _origError;
    }

    if (
      results &&
      results.facialTransformationMatrixes &&
      results.facialTransformationMatrixes.length > 0
    ) {
      const matrix = results.facialTransformationMatrixes[0].data;

      const rawYaw = (Math.atan2(matrix[2], matrix[10]) * 180) / Math.PI;
      const rawPitch = (Math.atan2(-matrix[6], matrix[10]) * 180) / Math.PI;

      return {
        yaw: rawYaw,
        pitch: rawPitch,
        faceDetected: true,
      };
    }

    return { yaw: 0, pitch: 0, faceDetected: false };
  };

  return { isLoaded, error, detectFrame };
}
