"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, ShieldCheck, Award, Rocket, CheckCircle } from "lucide-react";

const features = [
  {
    icon: <Briefcase size={28} className="text-[#10B981]" />,
    title: "Guaranteed Placement",
    description: "Land a job at a reputed IT company upon course completion with our dedicated placement cell.",
  },
  {
    icon: <Rocket size={28} className="text-[#0EA5E9]" />,
    title: "First IT Breakthrough",
    description: "We help freshers and non-IT background students get their first big break in the tech industry.",
  },
  {
    icon: <ShieldCheck size={28} className="text-[#D4AF37]" />,
    title: "Recession-Proof Career",
    description: "Build a future-safe career in the ever-growing IT sector with highly demanded skills.",
  },
  {
    icon: <Award size={28} className="text-[#10B981]" />,
    title: "Certified Trainers",
    description: "Learn directly from industry experts and certified professionals with years of real-world experience.",
  },
  {
    icon: <TrendingUp size={28} className="text-[#0EA5E9]" />,
    title: "Fast-Paced Growth",
    description: "The IT sector in India is growing rapidly. Position yourself for fast career advancement.",
  },
  {
    icon: <CheckCircle size={28} className="text-[#D4AF37]" />,
    title: "Complete Grooming",
    description: "Include interview preparation, soft skills, resume building, and corporate grooming.",
  },
];

export default function WhyMistSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="theme-bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold text-slate-900 mb-4">
              Why Choose <span className="text-[#10B981]">MIST</span>?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#10B981] to-transparent mx-auto rounded-full mb-6" />
            <p className="text-slate-600 max-w-2xl mx-auto">
              We don't just teach code, we build careers. Here's why hundreds of students choose MIST every year.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group hover:-translate-y-2 transition-all duration-300 hover:shadow-lg border border-slate-100 hover:border-[#10B981]/30 bg-white"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#10B981]/10 transition-all duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 font-space group-hover:text-[#10B981] transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
