"use client";

import { useGalleryStore } from "@/store/galleryStore";
import { PhotoEntry } from "@/lib/storage/photoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Trash2, Calendar, Tag, Sparkles } from "lucide-react";

export function PhotoDialog() {
  const selectedPhoto = useGalleryStore((s) => s.selectedPhoto);
  const setSelectedPhoto = useGalleryStore((s) => s.setSelectedPhoto);
  const deletePhoto = useGalleryStore((s) => s.deletePhoto);

  if (!selectedPhoto) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = selectedPhoto.blobUrl;
    a.download = `gazecam_${selectedPhoto.mode}_${new Date(selectedPhoto.createdAt).toISOString().replace(/[:.]/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this photo?")) {
      await deletePhoto(selectedPhoto.id);
      setSelectedPhoto(null);
    }
  };

  const formattedDate = new Date(selectedPhoto.createdAt).toLocaleString();

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "gaze":
        return { label: "Gaze Booby-Trap", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
      case "timer-3s":
        return { label: "Timer (3s Preset ~7s)", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
      case "timer-10s":
        return { label: "Timer (10s Preset Blitz)", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
      case "timer-5s":
        return { label: "Timer (5s Rickroll Trap)", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" };
      default:
        return { label: mode, color: "bg-zinc-800 text-zinc-300 border-zinc-700" };
    }
  };

  const modeInfo = getModeLabel(selectedPhoto.mode);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop overlay dismiss */}
        <div
          className="absolute inset-0"
          onClick={() => setSelectedPhoto(null)}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Display */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[420px]">
            {/* eslint-disable-next-html-element-for-jsx */}
            <img
              src={selectedPhoto.blobUrl}
              alt="GazeCam Capture"
              className="max-h-[75vh] w-full object-contain"
            />
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Photo Capture
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Mode Badge */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Capture Mode
                </span>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${modeInfo.color}`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{modeInfo.label}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
                <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                This photo was captured client-side with full local privacy and zero server uploads.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-950"
              >
                <Download className="w-4 h-4" />
                <span>Save Image</span>
              </button>

              <button
                onClick={handleDelete}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
