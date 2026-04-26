"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { addReview } from "@/app/actions";

export default function AddReviewModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user?: any }) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    formData.set("isVisible", "false");
    formData.set("rating", rating.toString());
    if (user) {
      formData.set("studentName", user.name);
      formData.set("userId", user.id);
    }
    
    startTransition(async () => {
      const res = await addReview(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 3000);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={20} />
          </button>

          <div className="p-10 md:p-12">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-slate-900 font-outfit mb-2">Share Your Story</h2>
                <p className="text-slate-500 mb-8 font-medium">Your review will be sent to the admin for approval before appearing on the site.</p>

                {user && (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-black">
                      {user.name.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Posting as</p>
                      <p className="text-sm font-black text-slate-900">{user.name}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-bold border border-red-100">
                    {error}
                  </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                  {!user && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                      <input name="studentName" required placeholder="Your Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Course *</label>
                    <input name="courseName" required placeholder="e.g. Full Stack Web Development" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button 
                          key={s} 
                          type="button"
                          onClick={() => setRating(s)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= s ? "bg-primary text-black" : "bg-slate-100 text-slate-300"}`}
                        >
                          <Star size={20} fill={rating >= s ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Review *</label>
                    <textarea name="reviewText" required rows={4} placeholder="Tell us about your experience..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold resize-none" />
                  </div>

                  <button 
                    disabled={isPending}
                    className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : "Submit for Approval"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 font-outfit mb-4">Review Received!</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Thank you for sharing your experience. Our team will review your story soon.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
