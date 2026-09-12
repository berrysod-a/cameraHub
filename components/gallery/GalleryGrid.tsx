"use client";

import { useEffect } from "react";
import { useGalleryStore } from "@/store/galleryStore";
import { PhotoDialog } from "./PhotoDialog";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, RefreshCw } from "lucide-react";

export function GalleryGrid() {
  const photos = useGalleryStore((s) => s.photos);
  const isLoading = useGalleryStore((s) => s.isLoading);
  const loadPhotos = useGalleryStore((s) => s.loadPhotos);
  const setSelectedPhoto = useGalleryStore((s) => s.setSelectedPhoto);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

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
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-none border border-dashed border-zinc-800 bg-zinc-900/40 text-center">
          <div className="p-4 bg-zinc-800/80 text-zinc-400 mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Photos Captured Yet</h3>
          <p className="text-sm text-zinc-400 max-w-md">
            Head over to the studio camera to take photos.
          </p>
        </div>
      )}

      {/* Responsive Animated Photo Grid — Sharp Corners (rounded-none) */}
      {!isLoading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {photos.map((photo) => {
              return (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square rounded-none overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-lg hover:shadow-2xl hover:border-zinc-500 transition-all cursor-pointer select-none"
                >
                  {/* eslint-disable-next-html-element-for-jsx */}
                  <img
                    src={photo.blobUrl}
                    alt="Captured photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Details Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{new Date(photo.createdAt).toLocaleTimeString()}</span>
                      </span>
                      <span className="text-zinc-300 group-hover:translate-x-0.5 transition-transform font-semibold">
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
