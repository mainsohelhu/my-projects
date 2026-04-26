"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star, User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import AddReviewModal from "./AddReviewModal";

export default function TestimonialsSection({ user }: { user?: any }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : [
    {
      studentName: "Ananya Sharma",
      courseName: "Full Stack Web Development",
      reviewText: "The mentorship at MIDAS is unparalleled. I went from knowing zero coding to building full-scale applications in just 6 months.",
      rating: 5,
      studentPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=80"
    },
    {
      studentName: "Vikram Malhotra",
      courseName: "Data Science & AI",
      reviewText: "Practical labs and real-world projects helped me land a job at a top tech company. The trainers are actually industry experts.",
      rating: 5,
      studentPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&q=80"
    },
    {
      studentName: "Sahil Khan",
      courseName: "Python Professional",
      reviewText: "Best place in Raipur for IT training. The environment is professional and the support team is always ready to help.",
      rating: 5,
      studentPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&q=80"
    }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % displayReviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [displayReviews.length]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest mb-6 rounded-full"
          >
            <Star size={14} fill="currentColor" className="text-primary" />
            Student Reviews
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold font-outfit text-slate-900">
            Real Stories from <span className="text-gradient">Real Students</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden px-4 py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-50 rounded-[40px] p-8 md:p-16 border border-slate-100 relative shadow-2xl shadow-slate-200/50"
              >
                <Quote className="absolute top-10 right-10 text-primary/10 w-24 h-24" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-8">
                    {Array(displayReviews[currentIndex].rating).fill(0).map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" className="text-primary" />
                    ))}
                  </div>

                  <p className="text-2xl md:text-3xl font-medium text-slate-700 italic leading-relaxed mb-12 relative z-10">
                    "{displayReviews[currentIndex].reviewText}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                      {displayReviews[currentIndex].studentPhoto ? (
                        <img 
                          src={displayReviews[currentIndex].studentPhoto} 
                          alt={displayReviews[currentIndex].studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-300" size={32} />
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-slate-900 font-outfit">{displayReviews[currentIndex].studentName}</h4>
                      <p className="text-primary font-bold text-xs uppercase tracking-widest">{displayReviews[currentIndex].courseName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 z-20 hidden md:block">
            <button onClick={prev} className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all shadow-xl">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 z-20 hidden md:block">
            <button onClick={next} className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all shadow-xl">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {displayReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-primary w-8" : "bg-slate-200"}`}
              />
            ))}
          </div>
          {/* Add Review CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            {user ? (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 font-black hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                <span>Add Your Review</span>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <Star size={16} fill="currentColor" />
                </div>
              </button>
            ) : (
              <Link 
                href="/login"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 font-black hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                <span>Log In to Share Review</span>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
    </section>
  );
}
