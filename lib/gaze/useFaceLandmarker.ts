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

        let landmarker: FaceLandmarker;
        try {
          landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            outputFacialTransformationMatrixes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          });
        } catch (gpuErr) {
          console.warn("GPU delegate failed for FaceLandmarker, falling back to CPU:", gpuErr);
          landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU",
            },
            outputFacialTransformationMatrixes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          });
        }

        if (isMounted) {
          landmarkerRef.current = landmarker;
          setIsLoaded(true);
        }
      } catch (err: any) {
        console.error("Failed to load FaceLandmarker:", err);
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
    if (!landmarkerRef.current || !videoElement || videoElement.readyState < 2) {
      return { yaw: 0, pitch: 0, faceDetected: false };
    }

    // Ensure timestampMs is strictly greater than previous timestamp
    let validTimestamp = Math.max(timestampMs, lastTimestampRef.current + 1);
    lastTimestampRef.current = validTimestamp;

    try {
      const results = landmarkerRef.current.detectForVideo(videoElement, validTimestamp);

      if (
        results &&
        results.facialTransformationMatrixes &&
        results.facialTransformationMatrixes.length > 0
      ) {
        const matrix = results.facialTransformationMatrixes[0].data;

        // Extract yaw and pitch per specification:
        // yaw = atan2(matrix[2], matrix[10]) * (180/PI)
        // pitch = atan2(-matrix[6], matrix[10]) * (180/PI)
        const rawYaw = (Math.atan2(matrix[2], matrix[10]) * 180) / Math.PI;
        const rawPitch = (Math.atan2(-matrix[6], matrix[10]) * 180) / Math.PI;

        return {
          yaw: rawYaw,
          pitch: rawPitch,
          faceDetected: true,
        };
      }
    } catch (err) {
      console.error("Detection error:", err);
    }

    return { yaw: 0, pitch: 0, faceDetected: false };
  };

  return { isLoaded, error, detectFrame };
}
