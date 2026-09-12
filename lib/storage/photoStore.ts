import { get, set, del, keys } from "idb-keyval";

export type CaptureMode = "gaze" | "timer-3s" | "timer-10s" | "timer-5s";

export interface StoredPhoto {
  id: string;
  blob: Blob;
  createdAt: number;
  mode: CaptureMode;
}

export interface PhotoEntry {
  id: string;
  blobUrl: string;
  createdAt: number;
  mode: CaptureMode;
}

const PHOTO_PREFIX = "gazecam_photo_";

export async function savePhotoToStorage(
  blob: Blob,
  mode: CaptureMode
): Promise<PhotoEntry> {
  const id = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const storedPhoto: StoredPhoto = {
    id,
    blob,
    createdAt: Date.now(),
    mode,
  };

  await set(`${PHOTO_PREFIX}${id}`, storedPhoto);

  const blobUrl = URL.createObjectURL(blob);
  return {
    id,
    blobUrl,
    createdAt: storedPhoto.createdAt,
    mode: storedPhoto.mode,
  };
}

export async function getAllPhotosFromStorage(): Promise<PhotoEntry[]> {
  try {
    const allKeys = await keys();
    const photoKeys = allKeys.filter(
      (k) => typeof k === "string" && k.startsWith(PHOTO_PREFIX)
    );

    const photos: PhotoEntry[] = [];
    for (const key of photoKeys) {
      const photo = (await get<StoredPhoto>(key)) as StoredPhoto | undefined;
      if (photo && photo.blob) {
        const blobUrl = URL.createObjectURL(photo.blob);
        photos.push({
          id: photo.id,
          blobUrl,
          createdAt: photo.createdAt,
          mode: photo.mode,
        });
      }
    }

    // Sort descending by creation date
    return photos.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error("Failed to load photos from IndexedDB:", err);
    return [];
  }
}

export async function deletePhotoFromStorage(id: string): Promise<void> {
  await del(`${PHOTO_PREFIX}${id}`);
}
