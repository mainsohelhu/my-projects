"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Search, X, Loader2, Star, User, CheckCircle2 } from "lucide-react";
import { addReview, deleteReview, toggleReviewVisibility } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function ReviewManager({ initialReviews }: { initialReviews: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleReviewVisibility(id, currentStatus);
    });
  };

  const filteredReviews = initialReviews.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addReview(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsAdding(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium"
          />
        </div>
        
        <button 
          onClick={() => { setIsAdding(!isAdding); setError(null); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            isAdding ? "bg-slate-900 text-white" : "bg-primary text-black"
          }`}
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? "Cancel" : "Add Review"}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl mb-10">
              <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-8">Add Student Review</h2>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Name *</label>
                  <input name="studentName" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Name *</label>
                  <input name="courseName" required placeholder="e.g. Full Stack Web Dev" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating (1-5)</label>
                  <select name="rating" defaultValue="5" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium appearance-none">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Review Text *</label>
                  <textarea name="reviewText" required rows={3} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Photo URL</label>
                  <input name="studentPhoto" placeholder="Image URL" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="flex items-center gap-4 lg:col-span-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isVisible" value="true" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-600">Visible on Site</span>
                  </label>
                  <button 
                    disabled={isPending}
                    className="ml-auto px-10 py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : "Post Review"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-white shadow-md">
                  {review.studentPhoto ? <img src={review.studentPhoto} alt="" className="w-full h-full object-cover" /> : <User className="text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{review.studentName}</h3>
                  <p className="text-xs text-primary font-bold">{review.courseName}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleToggleVisibility(review.id, review.isVisible)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                    review.isVisible 
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                      : "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-500 shadow-lg shadow-green-200"
                  }`}
                >
                  {review.isVisible ? <EyeOff size={14} /> : <CheckCircle2 size={14} />}
                  {review.isVisible ? "HIDE FROM SITE" : "APPROVE NOW"}
                </button>
                <button 
                  onClick={async () => { if(confirm("Are you sure you want to delete this review permanently?")) await deleteReview(review.id); }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <Trash2 size={14} />
                  DELETE
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {Array(review.rating).fill(0).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="text-primary" />
                ))}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                review.isVisible 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-red-50 text-red-700 border-red-200 animate-pulse"
              }`}>
                {review.isVisible ? "● Published" : "○ Pending Approval"}
              </span>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed italic">"{review.reviewText}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
