import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { FlashOverlay } from "@/components/camera/FlashOverlay";
import { RickrollOverlay } from "@/components/timer/RickrollOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camera",
  description: "Webcam Studio Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:bg-rose-500 selection:text-white`}
      >
        {/* Animated Background Flourish */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-900/30 via-rose-900/20 to-cyan-900/20 rounded-full blur-[140px]" />
          <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[120px]" />
        </div>

        {/* Global Nav Header */}
        <Navbar />

        {/* Global Overlays */}
        <FlashOverlay />
        <RickrollOverlay />

        {/* Main Content View */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
