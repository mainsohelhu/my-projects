"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ImageGallerySection() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Students coding together",
      span: "md:col-span-2 md:row-span-2",
      height: "h-[400px]",
    },
    {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Team collaboration",
      span: "md:col-span-1 md:row-span-1",
      height: "h-[190px]",
    },
    {
      src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Tech meeting",
      span: "md:col-span-1 md:row-span-1",
      height: "h-[190px]",
    },
    {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Modern campus",
      span: "md:col-span-2 md:row-span-1",
      height: "h-[200px]",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#0EA5E9]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/5 text-[#0F172A] text-xs font-bold font-space tracking-wider mb-4 border border-[#0F172A]/10">
              CAMPUS LIFE
            </div>
            <h2 className="text-4xl md:text-5xl font-space font-bold text-slate-900 mb-4">
              Life at <span className="text-[#10B981]">MIDAS</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Experience a vibrant, tech-focused environment designed to foster creativity, 
              collaboration, and career growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <button className="hidden md:flex items-center justify-center rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-[#10B981] hover:text-[#10B981]">
              View Full Gallery
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden rounded-2xl group ${image.span} ${image.height}`}
            >
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Optional Hover Overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end p-6">
                <span className="text-white font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
