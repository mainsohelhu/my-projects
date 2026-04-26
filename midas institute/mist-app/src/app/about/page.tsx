"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Users, Award, Target, BookOpen, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-[#f8fafc] border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Our Legacy</span>
            <h1 className="text-5xl md:text-7xl font-outfit font-bold text-slate-900 mb-8 leading-tight">
              Raipur's Premier <br /> <span className="text-gradient">IT Training Hub.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-light mb-10">
              Midas Institute of Software Technology is dedicated to bridging the gap between academic learning and industry requirements. Since our inception, we've empowered hundreds of students to launch successful careers in top MNCs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-slate-50">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Students Trained", value: "1500+", icon: Users, color: "#3b82f6" },
              { label: "Placement Rate", value: "100%", icon: Award, color: "#a3e635" },
              { label: "Expert Mentors", value: "15+", icon: Target, color: "#8b5cf6" },
              { label: "MNC Partnerships", value: "50+", icon: BookOpen, color: "#f43f5e" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-10 rounded-[50px] bg-white border border-slate-100 hover:border-primary/30 transition-all hover:shadow-2xl group relative overflow-hidden">
                <div className="relative w-20 h-20 mb-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <stat.icon size={40} className="absolute text-primary opacity-20 blur-md translate-y-1" />
                    <stat.icon size={40} className="relative text-primary drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                  </motion.div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2 font-outfit">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">{stat.label}</div>
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="aspect-square bg-white rounded-[80px] overflow-hidden border-8 border-slate-50 shadow-2xl relative flex flex-col items-center justify-center p-20 text-center group">
                  <motion.div
                    animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="relative mb-12"
                  >
                    <ShieldCheck size={140} className="absolute text-primary opacity-20 blur-xl scale-110" />
                    <ShieldCheck size={140} className="relative text-primary drop-shadow-[0_20px_50px_rgba(163,230,53,0.3)]" />
                  </motion.div>
                  <h3 className="text-4xl font-black text-slate-900 mb-4 font-outfit">ISO 9001:2015</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Certified Excellence</p>
                  <p className="text-slate-400 mt-4 text-sm font-medium italic">Maintaining global standards in technical education.</p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-20" />
            </div>
            
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-6 underline decoration-primary decoration-4 underline-offset-8">Our Vision</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To be the global leader in providing high-quality, industry-driven technical education and to foster an ecosystem where innovation meets execution. We strive to make Raipur the central hub for IT talent in India.
                </p>
              </div>
              <div className="space-y-6">
                <h2 className="text-4xl font-bold font-outfit text-slate-900 mb-6 underline decoration-primary decoration-4 underline-offset-8">Why Midas?</h2>
                <ul className="space-y-4">
                  {[
                    "Curriculum designed by Silicon Valley experts",
                    "Dedicated HR grooming and mock interviews",
                    "Lifetime access to our job portal",
                    "State-of-the-art laboratory facilities",
                    "Real-world capstone projects"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                      <CheckCircle className="text-primary" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
