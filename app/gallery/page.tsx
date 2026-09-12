import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata = {
  title: "Gallery — Camera",
  description: "View all captured photos.",
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-full">
      <GalleryGrid />
    </div>
  );
}
