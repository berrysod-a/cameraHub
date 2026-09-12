"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGazeState } from "@/lib/gaze/useGazeState";
import { useCaptureStore } from "@/store/captureStore";
import { useGalleryStore } from "@/store/galleryStore";
import { ShutterButton } from "./ShutterButton";
import { CountdownDisplay } from "@/components/timer/CountdownDisplay";
import { CameraOff, RefreshCw, Aperture } from "lucide-react";

interface CameraViewProps {
  onStartTimer?: () => void;
}

export function CameraView({ onStartTimer }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const activeMode = useCaptureStore((s) => s.activeMode);
  const captureState = useCaptureStore((s) => s.captureState);
  const setCaptureState = useCaptureStore((s) => s.setCaptureState);
  const activeTimerPreset = useCaptureStore((s) => s.activeTimerPreset);
  const addPhoto = useGalleryStore((s) => s.addPhoto);

  const { isLoaded, error: landmarkerError } = useGazeState(videoRef);

  // Initialize WebCam Stream
  const initWebcam = useCallback(async () => {
    try {
      setPermissionError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          `Camera API is blocked by your browser when accessed via IP address (${window.location.hostname}) over HTTP. Please open http://localhost:3000 in your browser instead!`
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setHasPermission(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setHasPermission(false);
      setPermissionError(
        err.message ||
          (err.name === "NotAllowedError"
            ? "Camera permission was denied. Please allow camera access in your browser settings to use the Camera."
            : "Could not access webcam. Please check if your camera is connected and not in use by another app.")
      );
    }
  }, []);

  useEffect(() => {
    initWebcam();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initWebcam]);

  // Handle Photo Capture from live canvas frame
  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Mirror canvas to match selfie display feed
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const modeTag =
            activeMode === "gaze" ? "gaze" : (`timer-${activeTimerPreset}` as any);
          await addPhoto(blob, modeTag);
        }
        setCaptureState("CAPTURED");
        setTimeout(() => setCaptureState("IDLE"), 800);
      },
      "image/jpeg",
      0.95
    );
  }, [activeMode, activeTimerPreset, addPhoto, setCaptureState]);

  useEffect(() => {
    if (captureState === "CAPTURING") {
      captureFrame();
    }
  }, [captureState, captureFrame]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto px-4 flex-1 select-none">
      {/* Main Standalone Viewfinder Window — Sharp Corners (rounded-none) */}
      <div className="relative w-full aspect-[16/10] md:aspect-video max-h-[70vh] rounded-none overflow-hidden bg-zinc-950 border border-zinc-800/80 shadow-2xl group flex items-center justify-center">
        {/* Hidden Canvas for Frame Grab */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${
            hasPermission ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Top-Right In-Frame Countdown Overlay (No background panel) */}
        <CountdownDisplay />

        {/* Sleek Minimal Corner Accents */}
        {hasPermission && (
          <>
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30" />

            {/* Subtle Resolution Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] font-mono text-zinc-300">
              <Aperture className="w-3 h-3 text-zinc-400" />
              <span>HD</span>
            </div>
          </>
        )}

        {/* Loading State */}
        {hasPermission === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin text-zinc-300" />
            <p className="text-xs font-mono">Initializing camera...</p>
          </div>
        )}

        {/* Fallback Permission Denied UI */}
        {hasPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/95 text-zinc-200">
            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
              <CameraOff className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Camera Access Required</h3>
            <p className="text-xs text-zinc-400 max-w-md mb-4">{permissionError}</p>
            <button
              onClick={initWebcam}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
          </div>
        )}

        {landmarkerError && (
          <div className="absolute bottom-2 left-2 right-2 bg-zinc-900/90 text-zinc-400 text-[10px] px-3 py-1 rounded border border-zinc-800 font-mono">
            Detector init status: {landmarkerError}
          </div>
        )}
      </div>

      {/* Centered Shutter Button Controls Below Viewfinder */}
      <ShutterButton onStartTimer={onStartTimer} />
    </div>
  );
}
