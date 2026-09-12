import { create } from "zustand";
import {
  PhotoEntry,
  getAllPhotosFromStorage,
  savePhotoToStorage,
  deletePhotoFromStorage,
  CaptureMode,
} from "@/lib/storage/photoStore";

interface GalleryStore {
  photos: PhotoEntry[];
  isLoading: boolean;
  selectedPhoto: PhotoEntry | null;

  loadPhotos: () => Promise<void>;
  addPhoto: (blob: Blob, mode: CaptureMode) => Promise<PhotoEntry>;
  deletePhoto: (id: string) => Promise<void>;
  setSelectedPhoto: (photo: PhotoEntry | null) => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  photos: [],
  isLoading: true,
  selectedPhoto: null,

  loadPhotos: async () => {
    set({ isLoading: true });
    const photos = await getAllPhotosFromStorage();
    set({ photos, isLoading: false });
  },

  addPhoto: async (blob: Blob, mode: CaptureMode) => {
    const entry = await savePhotoToStorage(blob, mode);
    set((state) => ({
      photos: [entry, ...state.photos],
    }));
    return entry;
  },

  deletePhoto: async (id: string) => {
    await deletePhotoFromStorage(id);
    set((state) => ({
      photos: state.photos.filter((p) => p.id !== id),
      selectedPhoto:
        state.selectedPhoto?.id === id ? null : state.selectedPhoto,
    }));
  },

  setSelectedPhoto: (photo: PhotoEntry | null) => set({ selectedPhoto: photo }),
}));
