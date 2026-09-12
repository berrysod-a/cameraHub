"use client";

import { useGalleryStore } from "@/store/galleryStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";

export function PhotoDialog() {
  const selectedPhoto = useGalleryStore((s) => s.selectedPhoto);
  const setSelectedPhoto = useGalleryStore((s) => s.setSelectedPhoto);
  const deletePhoto = useGalleryStore((s) => s.deletePhoto);

  if (!selectedPhoto) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = selectedPhoto.blobUrl;
    a.download = `camera_${selectedPhoto.mode}_${new Date(selectedPhoto.createdAt).toISOString().replace(/[:.]/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    if (confirm("Delete this photo?")) {
      await deletePhoto(selectedPhoto.id);
      setSelectedPhoto(null);
    }
  };

  const formattedDate = new Date(selectedPhoto.createdAt).toLocaleString();

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "gaze":           return "Gaze Mode";
      case "timer-3s":       return "Timer (3s)";
      case "timer-10s":      return "Timer (10s)";
      case "timer-5s":       return "Timer (5s)";
      default:               return mode;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={() => setSelectedPhoto(null)} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-3 right-3 z-20 p-2 bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Display */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[420px]">
            <img
              src={selectedPhoto.blobUrl}
              alt="Captured photo"
              className="max-h-[75vh] w-full object-contain"
            />
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-72 p-6 flex flex-col justify-between bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">Photo Capture</h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Mode Label — monochrome, sharp */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Capture Mode
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-none">
                  <span>{getModeLabel(selectedPhoto.mode)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-sm transition-colors"
              >
                <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                <span>Save</span>
              </button>

              <button
                onClick={handleDelete}
                className="p-2.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
                title="Delete Photo"
                aria-label="Delete Photo"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
