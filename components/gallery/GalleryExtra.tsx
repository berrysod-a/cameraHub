"use client";

/**
 * ============================================================================
 * GALLERY EXTRA PLACEHOLDER COMPONENT
 * ============================================================================
 * Reserved mounting slot for upcoming feature additions (e.g., photo filters,
 * meme generator overlay, or AI captioning).
 *
 * This component is rendered within the GalleryGrid layout, making it seamless
 * to extend without refactoring the grid or state management.
 * ============================================================================
 */

import { Sparkles, Construction } from "lucide-react";

export function GalleryExtra() {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-dashed border-indigo-500/40 bg-indigo-950/20 p-6 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-400 hover:bg-indigo-950/30 aspect-square">
      <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
        <Sparkles className="w-6 h-6" />
      </div>

      <h4 className="text-sm font-bold text-indigo-200 mb-1">
        Reserved Feature Slot
      </h4>

      <p className="text-xs text-indigo-300/70 max-w-[180px] leading-relaxed mb-3">
        Reserved for upcoming hackathon extra (Meme captioner / AI roasting).
      </p>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
        <Construction className="w-3 h-3" />
        <span>GalleryExtra.tsx</span>
      </div>
    </div>
  );
}
