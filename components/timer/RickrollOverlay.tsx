"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCaptureStore } from "@/store/captureStore";

export function RickrollOverlay() {
  const showRickrollOverlay = useCaptureStore((s) => s.showRickrollOverlay);
  const setShowRickrollOverlay = useCaptureStore((s) => s.setShowRickrollOverlay);
  const triggerCapture = useCaptureStore((s) => s.triggerCapture);

  const pipVideoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-dismiss after 12 seconds & trigger reaction capture
  useEffect(() => {
    if (!showRickrollOverlay) return;

    let timerId: NodeJS.Timeout;
    let animId: number;

    // Attach live webcam stream to PiP reaction video element
    const attachStream = () => {
      const allVideos = Array.from(document.querySelectorAll("video"));
      // Find the main camera feed video with an active MediaStream
      const mainVideo = allVideos.find(
        (v) => v !== pipVideoRef.current && v.srcObject instanceof MediaStream
      );

      if (mainVideo && mainVideo.srcObject && pipVideoRef.current) {
        pipVideoRef.current.srcObject = mainVideo.srcObject;
        pipVideoRef.current.play().catch(() => {});
      } else {
        // Retry next frame if main video stream is still initializing
        animId = requestAnimationFrame(attachStream);
      }
    };

    // Delay slightly to ensure PiP DOM node is mounted
    timerId = setTimeout(() => {
      attachStream();
    }, 50);

    const autoDismissTimer = setTimeout(() => {
      setShowRickrollOverlay(false);
      triggerCapture();
    }, 12000); // 12 seconds

    return () => {
      clearTimeout(timerId);
      clearTimeout(autoDismissTimer);
      cancelAnimationFrame(animId);
    };
  }, [showRickrollOverlay, setShowRickrollOverlay, triggerCapture]);

  const handleSkip = () => {
    setShowRickrollOverlay(false);
    triggerCapture();
  };

  if (!showRickrollOverlay) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl select-none">
        {/* Dominant Large Video Focal Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black"
        >
          <iframe
            className="w-full h-full object-cover pointer-events-none"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&mute=0&loop=1&playlist=dQw4w9WgXcQ"
            title="Surprise Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Subtly styled skip button in top right */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/80 text-zinc-400 hover:text-white border border-white/10 text-xs font-mono transition-colors"
          >
            Skip →
          </button>

          {/* Live PiP Webcam Reaction Corner Feed */}
          <div className="absolute bottom-4 right-4 z-20 w-44 md:w-56 aspect-video rounded-xl overflow-hidden border-2 border-rose-500 shadow-2xl bg-black">
            <video
              ref={pipVideoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
              REC • REACTION
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
