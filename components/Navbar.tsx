"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGalleryStore } from "@/store/galleryStore";
import { Camera as CameraIcon, Images } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const photos = useGalleryStore((s) => s.photos);

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 border-b border-zinc-800/60 backdrop-blur-xl select-none">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand logo / wordmark: "Camera" */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="font-semibold text-base text-zinc-100 tracking-tight">
            Camera
          </span>
        </Link>

        {/* Navigation Links: Studio & Gallery */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname === "/"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <CameraIcon className="w-3.5 h-3.5" />
            <span>Studio</span>
          </Link>

          <Link
            href="/gallery"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pathname === "/gallery"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Images className="w-3.5 h-3.5" />
            <span>Gallery</span>
            {photos.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono border border-zinc-700">
                {photos.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
