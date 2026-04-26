"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import EnquiryFormModal from "@/components/forms/EnquiryFormModal";
import { useSiteTheme } from "@/components/providers/SiteThemeProvider";

export default function HeroSection() {
  const [init, setInit] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { theme } = useSiteTheme();
  const isPurple = theme === "purple-dark";
  const isRedWhite = theme === "red-white";
  const isDark = isPurple;

  const particleColor   = isPurple ? "#8b5cf6" : isRedWhite ? "#e11d48" : "#a3e635";
  const particleOpacity = isDark ? 0.7 : 0.8;
  const logoSrc = theme === "purple-dark" ? "/logo-purple.png" : theme === "red-white" ? "/logo-red.png" : "/logo.jpeg";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      }).catch(err => {
        console.error("Particles failed", err);
        setInit(true);
      });
    } catch (e) {
      setInit(true);
    }
    const timer = setTimeout(() => setInit(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <section className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-20">

      {/* Red radial glow — only visible in crimson theme via CSS */}
      <div className="hero-glow-orb absolute inset-0 z-0 pointer-events-none" />

      {/* Particles Effect */}
      {init && (
        <Particles
          key={theme} /* re-init when theme changes */
          id="tsparticles"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: particleOpacity }}
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
              events: { onHover: { enable: true, mode: "grab" } },
              modes: { grab: { distance: 200, links: { opacity: 0.4 } } },
            },
            particles: {
              color: { value: particleColor },
              links: {
                color: particleColor,
                distance: 180,
                enable: true,
                opacity: isDark ? 0.4 : 0.3,
                width: 1.5,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: true,
                speed: 1.2,
                straight: false,
              },
              number: {
                density: { enable: true, width: 800 },
                value: 60,
              },
              opacity: { value: { min: 0.2, max: isDark ? 0.8 : 0.6 } },
              shape: { type: "circle" },
              size: { value: { min: 2, max: 4 } },
            },
            detectRetina: true,
          }}
        />
      )}
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <Image 
              src={logoSrc} 
              alt="MIDAS Logo" 
              width={180} 
              height={180} 
              className="relative z-10 drop-shadow-2xl bg-white rounded-full p-3 border border-slate-100"
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4 text-slate-900 font-outfit uppercase">
              <span className="text-primary">M</span>IDAS <span className="text-primary italic">INSTITUTE</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-500 max-w-4xl mx-auto font-light leading-relaxed mb-10">
              <span className="text-slate-900 font-black text-xl md:text-3xl block mb-2 uppercase tracking-wide">
                Midas Institute of Software Technology
              </span>
              <span className="text-primary font-bold uppercase tracking-[0.4em] text-sm md:text-lg block">
                Computer Education
              </span>
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <button
              onClick={() => setEnquiryOpen(true)}
              className="px-12 py-5 bg-primary text-black font-black rounded-2xl flex items-center gap-3 hover:bg-black hover:text-primary transition-all hover:scale-105 group shadow-2xl shadow-primary/30 text-lg"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div className="absolute w-full h-full bg-black/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:rotate-45 transition-transform" />
              </div>
              Enquire Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/courses" 
              className="px-12 py-5 bg-black text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all hover:scale-105 group shadow-2xl shadow-black/20"
            >
              Explore Programs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact" 
              className="px-10 py-5 glass-morphism text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all border border-slate-300 shadow-lg"
            >
              Contact Admission
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-10 border-t border-slate-200 w-full max-w-4xl"
          >
            <div className="text-center">
              <div className="text-slate-900 text-3xl font-black mb-1">#1</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">In Raipur</div>
            </div>
            <div className="text-center">
              <div className="text-slate-900 text-3xl font-black mb-1">100%</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Placement</div>
            </div>
            <div className="text-center">
              <div className="text-slate-900 text-3xl font-black mb-1">10+</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-slate-900 text-3xl font-black mb-1">500+</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">Success Stories</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-60"
      >
        <ChevronDown className="w-10 h-10 text-primary" />
      </motion.div>

      <EnquiryFormModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
