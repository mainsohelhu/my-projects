"use client";
import { motion } from "framer-motion";
import { Briefcase, Zap, ShieldCheck, GraduationCap, TrendingUp, Sparkles } from "lucide-react";

const benefits = [
  { text: "Direct job placement in reputed MNCs and tech firms.", icon: Briefcase, color: "#3b82f6" },
  { text: "Your first IT sector breakthrough immediately after course completion.", icon: Zap, color: "#f59e0b" },
  { text: "Future-proof career in a recession-resilient industry.", icon: ShieldCheck, color: "#10b981" },
  { text: "Learn from elite, certified trainers with deep industry expertise.", icon: GraduationCap, color: "#8b5cf6" },
  { text: "Ride the wave of India's hyper-growth in the global IT sector.", icon: TrendingUp, color: "#f43f5e" },
  { text: "Holistic grooming: Interview prep, soft skills, and personality development.", icon: Sparkles, color: "#06b6d4" }
];

// Doubling the array for seamless infinite scroll
const marqueeItems = [...benefits, ...benefits];

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-4 md:px-8 relative z-10 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4"
          >
            Excellence Guaranteed
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6"
          >
            Why Choose the <br /> <span className="text-gradient">MIDAS Advantage?</span>
          </motion.h2>
          <p className="text-slate-500 text-lg font-light">
            We provide more than just education; we provide a launchpad for your global IT career.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Carousel */}
      <div className="relative flex overflow-hidden py-10 select-none">
        <motion.div 
          className="flex whitespace-nowrap gap-8"
          animate={{ x: [0, -2400] }} // Adjust based on total width
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((benefit, index) => (
            <div
              key={index}
              className="carousel-benefit-card inline-flex flex-col w-[450px] shrink-0 glass-morphism p-12 rounded-[50px] relative group border border-slate-100 bg-white hover:border-primary/30 transition-all duration-700 shadow-sm hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              {/* 3D Animated Icon Stack */}
              <div className="relative w-24 h-24 mb-10">
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotateZ: [-2, 2, -2],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                  className="relative w-full h-full flex items-center justify-center z-10"
                >
                  <benefit.icon 
                    size={56} 
                    className="absolute text-primary opacity-20 blur-xl translate-y-3 translate-x-2 scale-110" 
                  />
                  <benefit.icon 
                    size={56} 
                    className="absolute text-slate-100 translate-y-1.5 translate-x-1" 
                  />
                  <benefit.icon 
                    size={56} 
                    className="relative text-primary drop-shadow-2xl group-hover:scale-125 transition-transform duration-700" 
                  />
                </motion.div>
                
                <div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 blur-2xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: benefit.color }}
                />
              </div>

              <p className="carousel-benefit-text text-slate-800 text-2xl font-bold leading-relaxed whitespace-normal group-hover:text-primary transition-colors duration-500 font-outfit">
                {benefit.text}
              </p>
              
              <div className="carousel-benefit-badge absolute top-10 right-14 text-[80px] font-black text-slate-100/30 group-hover:text-primary/10 transition-all duration-700 pointer-events-none font-outfit">
                0{ (index % benefits.length) + 1 }
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Overlays */}
        <div className="carousel-fade-left absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="carousel-fade-right absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
