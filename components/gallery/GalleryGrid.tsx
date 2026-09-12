"use client";

import { useEffect } from "react";
import { useGalleryStore } from "@/store/galleryStore";
import { GalleryExtra } from "./GalleryExtra";
import { PhotoDialog } from "./PhotoDialog";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, Tag, RefreshCw } from "lucide-react";

export function GalleryGrid() {
  const photos = useGalleryStore((s) => s.photos);
  const isLoading = useGalleryStore((s) => s.isLoading);
  const loadPhotos = useGalleryStore((s) => s.loadPhotos);
  const setSelectedPhoto = useGalleryStore((s) => s.setSelectedPhoto);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case "gaze":
        return { label: "Gaze Trap", bg: "bg-rose-500/80 text-white" };
      case "timer-3s":
        return { label: "Timer 3s", bg: "bg-amber-500/80 text-white" };
      case "timer-10s":
        return { label: "Timer 10s", bg: "bg-cyan-500/80 text-white" };
      case "timer-5s":
        return { label: "Rickroll Trap", bg: "bg-purple-500/80 text-white" };
      default:
        return { label: mode, bg: "bg-zinc-800 text-zinc-300" };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-zinc-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <span>Loading local photo gallery...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 text-center">
          <div className="p-4 rounded-full bg-zinc-800/80 text-zinc-400 mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Photos Captured Yet</h3>
          <p className="text-sm text-zinc-400 max-w-md mb-6">
            Head over to the camera studio, look away from the camera, and let the booby trap take your photo!
          </p>
        </div>
      )}

      {/* Responsive Animated Photo Grid */}
      {!isLoading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {/* Render Reserved GalleryExtra Component Slot at index 0 or alongside photos */}
          <GalleryExtra />

          <AnimatePresence>
            {photos.map((photo) => {
              const badge = getModeBadge(photo.mode);
              return (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all cursor-pointer select-none"
                >
                  {/* eslint-disable-next-html-element-for-jsx */}
                  <img
                    src={photo.blobUrl}
                    alt="Captured photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Mode Badge Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md shadow-md ${badge.bg}`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Hover Details Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{new Date(photo.createdAt).toLocaleTimeString()}</span>
                      </span>
                      <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal Dialog for Selected Photo */}
      <PhotoDialog />
    </div>
  );
}
