"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Video as VideoIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSiteTheme } from "@/components/providers/SiteThemeProvider";

export default function VideoGallerySection() {
  const { theme } = useSiteTheme();
  const logoSrc = theme === "purple-dark" ? "/logo-purple.png" : theme === "red-white" ? "/logo-red.png" : "/logo.jpeg";
  const defaultThumb = logoSrc;
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    if (url.includes("youtube.com/shorts/")) return url.replace("shorts/", "embed/");
    if (url.includes("instagram.com/p/") || url.includes("instagram.com/reels/")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}embed/captioned/`;
    }
    if (url.includes("drive.google.com/file/d/")) {
      return url.replace("/view", "/preview").replace("/edit", "/preview");
    }
    return url;
  };


  const displayVideos = videos.length > 0 ? videos : [
    { id: 1, title: "Classroom Session - Full Stack", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" },
    { id: 2, title: "Student Success Story", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" },
    { id: 3, title: "Our Training Methodology", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80" },
  ];

  const nextVideo = () => {
    if (activeVideoIndex !== null) {
      setActiveVideoIndex((activeVideoIndex + 1) % displayVideos.length);
    }
  };

  const prevVideo = () => {
    if (activeVideoIndex !== null) {
      setActiveVideoIndex((activeVideoIndex - 1 + displayVideos.length) % displayVideos.length);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="theme-bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-4 rounded-full"
            >
              <VideoIcon size={14} />
              Visual Tour
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold font-outfit text-white leading-tight"
            >
              Experience <span className="text-gradient">MIDAS</span> Life
            </motion.h2>
          </div>

          <div className="flex gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Video Cards — small fixed-size horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {displayVideos.map((video, idx) => (
            <motion.div
              key={video.id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveVideoIndex(idx)}
              style={{ minWidth: "180px", maxWidth: "180px" }}
              className="rounded-[16px] overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer snap-center relative group shadow-lg flex-none"
            >
              {/* 16:9 thumbnail */}
              <div className="relative overflow-hidden" style={{ height: "101px" }}>
                <img
                  src={video.thumbnail || defaultThumb}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
              {/* Title */}
              <div className="p-3">
                <h3 className="text-white font-bold text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1">Watch →</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Player */}
      <AnimatePresence>
        {activeVideoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center backdrop-blur-2xl gap-5"
          >
            {/* Prev / Next arrows (desktop sides) */}
            <button
              onClick={prevVideo}
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white items-center justify-center hover:bg-primary hover:text-black transition-all border border-white/10 shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextVideo}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white items-center justify-center hover:bg-primary hover:text-black transition-all border border-white/10 shadow-xl"
            >
              <ChevronRight size={24} />
            </button>

            {/* Player — fixed 400×300 */}
            <motion.div
              key={activeVideoIndex}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              style={{ width: "400px", maxWidth: "calc(100vw - 32px)" }}
              className="rounded-[24px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10 bg-zinc-950"
            >
              {/* Video iframe — 400×300 */}
              <div style={{ width: "100%", height: "300px" }}>
                <iframe
                  src={getEmbedUrl(displayVideos[activeVideoIndex].url)}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Video title */}
              <div className="px-5 py-3 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm font-outfit">{displayVideos[activeVideoIndex].title}</h3>
                  <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    MIDAS Institute
                  </div>
                </div>
                <span className="text-white/30 text-xs font-bold">{activeVideoIndex + 1} / {displayVideos.length}</span>
              </div>
            </motion.div>

            {/* Back button — below the video */}
            <button
              onClick={() => setActiveVideoIndex(null)}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black hover:bg-primary transition-all shadow-xl font-black text-sm uppercase tracking-widest"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {/* Mobile prev/next */}
            <div className="flex gap-4 md:hidden">
              <button onClick={prevVideo} className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all border border-white/10">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextVideo} className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all border border-white/10">
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
