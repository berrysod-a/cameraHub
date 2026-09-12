"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCaptureStore } from "@/store/captureStore";

export function FlashOverlay() {
  const captureState = useCaptureStore((s) => s.captureState);
  const isCapturing = captureState === "CAPTURING";

  return (
    <AnimatePresence>
      {isCapturing && (
        <motion.div
          key="flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="fixed inset-0 bg-white z-50 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
