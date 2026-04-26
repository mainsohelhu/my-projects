"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, GitBranch, Star } from "lucide-react";
import { seedTrainers } from "@/app/actions";

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&auto=format&fit=crop",
];

function TrainerCard({ trainer, idx }: { trainer: any; idx: number }) {
  const photoUrl = trainer.photo || DEMO_PHOTOS[idx % DEMO_PHOTOS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group relative flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 p-8 h-full"
    >
      {/* Top Section: Image & Basic Info */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* 250x250 Image */}
        <div className="relative w-[250px] h-[250px] overflow-hidden rounded-[2rem] mb-6 shrink-0 bg-slate-100 shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
          <img
            src={photoUrl}
            alt={trainer.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Details Below Image */}
        <div className="flex flex-col items-center">
          <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-2">
            {trainer.role}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold font-outfit text-slate-900 mb-3">
            {trainer.name}
          </h3>
          <div className="bg-slate-50 text-slate-600 border border-slate-200 px-4 py-1.5 text-xs font-bold rounded-full">
            {trainer.experience} Experience
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-grow text-center">
        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
          {trainer.shortBio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {trainer.skills.slice(0, 4).map((skill: string) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary/5 text-slate-700 border border-primary/10 rounded-full text-xs font-bold"
            >
              {skill}
            </span>
          ))}
          {trainer.skills.length > 4 && (
            <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-xs font-bold">
              +{trainer.skills.length - 4}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
          <Link
            href={`/trainers/${trainer.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors"
          >
            Full Profile <ArrowRight size={16} />
          </Link>
          <div className="flex items-center gap-2">
            {trainer.linkedin && (
              <a
                href={trainer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0077b5] hover:bg-[#0077b5]/10 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {trainer.github && (
              <a
                href={trainer.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <GitBranch size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrainersSection() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startSeed] = useTransition();

  const fetchTrainers = async () => {
    try {
      const res = await fetch("/api/trainers");
      const data = await res.json();
      setTrainers(Array.isArray(data) ? data : []);
    } catch {
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (!loading && trainers.length === 0) {
      startSeed(async () => {
        await seedTrainers();
        fetchTrainers();
      });
    }
  }, [loading, trainers.length]);

  const visible = trainers.filter((t) => t.isVisible);

  return (
    <section id="trainers" className="bg-[#f8fafc] relative w-full py-32 overflow-hidden border-y border-slate-100">
      {/* Subtle Background Elements - Theme Aware */}
      <div className="theme-bg-glow absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="theme-bg-glow absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-primary text-xs font-black uppercase tracking-widest mb-6 rounded-full shadow-sm">
            <Star size={14} fill="currentColor" />
            Meet The Experts
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit text-slate-900 mb-6">
            Learn From <span className="text-gradient">Industry Veterans</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Our trainers aren&apos;t just teachers — they are working
            professionals who bring real project experience into every class.
          </p>
        </motion.div>

        {/* CARDS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[600px] bg-white rounded-[2rem] animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium">No trainers to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {visible.map((trainer, idx) => (
              <TrainerCard key={trainer.id} trainer={trainer} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
