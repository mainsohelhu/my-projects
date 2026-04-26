"use client";

import { addCourse } from "@/app/actions";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCourseForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await addCourse(formData);
    setIsPending(false);
    router.push("/admin/courses");
    router.refresh();
  }

  return (
    <div className="glass-morphism p-10 rounded-[40px] border border-slate-200 bg-white shadow-xl">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
        <BookOpen size={32} />
      </div>
      
      <h1 className="text-3xl font-bold font-outfit mb-2 text-slate-900">Create New Program</h1>
      <p className="text-slate-500 mb-10">Define the curriculum and details for your new course.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course Title</label>
          <input 
            name="title" 
            type="text" 
            placeholder="e.g. Full Stack Web Development" 
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-slate-900 font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
            <input 
              name="duration" 
              type="text" 
              placeholder="e.g. 6 Months" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-slate-900 font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (Optional)</label>
            <input 
              name="price" 
              type="text" 
              placeholder="e.g. ₹25,000" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course Description</label>
          <textarea 
            name="description" 
            rows={4}
            placeholder="Describe what students will learn..." 
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-all text-slate-900 resize-none font-medium"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-primary hover:text-black transition-all text-lg shadow-xl shadow-black/10 disabled:opacity-50"
        >
          {isPending ? "Publishing..." : "Publish Course"}
        </button>
      </form>
    </div>
  );
}
