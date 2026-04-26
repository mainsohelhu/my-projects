"use client";

import { useState, useTransition } from "react";
import { BookOpen, Plus, Trash2, Search, X, Edit3, Check, FilePlus, Loader2, Eye, EyeOff } from "lucide-react";
import { addCourse, deleteCourse, editCourse } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseManager({ initialCourses }: { initialCourses: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredCourses = initialCourses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addCourse(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsAdding(false);
      }
    });
  };

  const handleEdit = async (formData: FormData) => {
    if (!editingCourse) return;
    setError(null);
    startTransition(async () => {
      const res = await editCourse(editingCourse.id, formData);
      if (res.error) {
        setError(res.error);
      } else {
        setEditingCourse(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search programs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium"
          />
        </div>
        
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingCourse(null); setError(null); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            isAdding ? "bg-slate-900 text-white" : "bg-primary text-black"
          }`}
        >
          {isAdding ? <X size={20} /> : <FilePlus size={20} />}
          {isAdding ? "Cancel" : "Add Program"}
        </button>
      </div>

      {/* Course Form (Collapsible for Add/Edit) */}
      <AnimatePresence>
        {(isAdding || editingCourse) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl mb-10">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold text-slate-900 font-outfit">
                    {editingCourse ? "Edit Program" : "Define New Program"}
                 </h2>
                 {editingCourse && (
                   <button onClick={() => setEditingCourse(null)} className="w-8 h-8 flex justify-center items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                     <X size={16} />
                   </button>
                 )}
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form action={editingCourse ? handleEdit : handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1 lg:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Title *</label>
                  <input name="title" defaultValue={editingCourse?.title || ""} required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration *</label>
                  <input name="duration" defaultValue={editingCourse?.duration || ""} required placeholder="e.g. 6 Months" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                  <input name="price" defaultValue={editingCourse?.price || ""} placeholder="e.g. ₹25,000" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1 lg:col-span-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brief Description *</label>
                  <input name="description" defaultValue={editingCourse?.description || ""} required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="flex flex-col justify-end gap-2 lg:col-start-4">
                  <label className="flex items-center gap-2 cursor-pointer mb-2 px-2">
                    <input type="checkbox" name="showPrice" value="true" defaultChecked={editingCourse ? editingCourse.showPrice : true} className="w-4 h-4 text-primary rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-600">Show Price Publicly</span>
                  </label>
                  <button 
                    disabled={isPending}
                    className="w-full py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : editingCourse ? "Save Changes" : "Launch Program"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-20 text-center bg-white rounded-[40px] border border-slate-100 text-slate-400 font-medium italic">
            No academic programs found.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="glass-morphism p-8 rounded-[40px] border border-slate-100 bg-white group hover:shadow-xl transition-all relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                    <BookOpen size={24} />
                 </div>
                 <div className="flex gap-2">
                   <button 
                    onClick={() => { setEditingCourse(course); setIsAdding(false); }}
                    className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                    title="Edit Course"
                   >
                    <Edit3 size={18} />
                   </button>
                   <button 
                    onClick={async () => { if(confirm("Delete course?")) await deleteCourse(course.id); }}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    title="Delete Course"
                   >
                    <Trash2 size={18} />
                   </button>
                 </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">{course.title}</h3>
              <div className="flex items-center gap-3 mb-4">
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{course.duration}</p>
                 {course.price && (
                   <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                     {course.price}
                   </span>
                 )}
              </div>
              <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-6">
                {course.description}
              </p>
              
              <div className="pt-6 border-t border-slate-50 mt-auto flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live on Site</span>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {course.showPrice ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-slate-300" />}
                    {course.showPrice ? "Price Visible" : "Price Hidden"}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
