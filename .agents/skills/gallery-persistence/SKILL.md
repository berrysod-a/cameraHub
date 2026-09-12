---
name: gallery-persistence
description: Documents IndexedDB storage approach via idb-keyval and the reserved GalleryExtra placeholder slot
---

# Gallery Persistence & Architecture

## Overview
Captured photos in GazeCam are stored locally in the browser's IndexedDB via `idb-keyval`. This avoids `localStorage` 5MB quota restrictions and allows saving full-resolution JPEG blobs client-side with zero server calls.

## Data Structure
```typescript
interface StoredPhoto {
  id: string; // `photo_${Date.now()}_${rand}`
  blob: Blob; // Raw JPEG blob
  createdAt: number; // Date timestamp
  mode: "gaze" | "timer-3s" | "timer-10s" | "timer-5s";
}
```

## Key-Val Storage Schema
- **Key Format**: `gazecam_photo_${id}`
- **Storage Methods**: `set`, `get`, `del`, `keys` from `idb-keyval`.
- **Blob Object URL Management**: Converted to `URL.createObjectURL(blob)` on load.

## Gallery Extra Mounting Point
- `components/gallery/GalleryExtra.tsx`: Reserved placeholder mounted as a permanent grid item in `GalleryGrid.tsx`.
- **Purpose**: Reserved for future hackathon extensions (such as photo filters, AI captioning, or meme generation) without refactoring grid layout or store architecture.
