"use client";

import { useState, useTransition } from "react";
import { Award, Plus, Trash2, Search, X, Building2, Briefcase, Calendar, Trophy, Loader2 } from "lucide-react";
import { addPlacement, deletePlacement } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function PlacementManager({ initialPlacements }: { initialPlacements: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredPlacements = initialPlacements.filter(p => 
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addPlacement(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsAdding(false);
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
            placeholder="Search by student or company..." 
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
          {isAdding ? <X size={20} /> : <Trophy size={20} />}
          {isAdding ? "Cancel" : "Add Success Story"}
        </button>
      </div>

      {/* Placement Form (Collapsible) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-outfit">Log New Placement</h2>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Name</label>
                  <input name="studentName" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hiring Company</label>
                  <input name="company" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Role</label>
                  <input name="role" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="flex items-end">
                  <button 
                    disabled={isPending}
                    className="w-full py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : "Publish Story"}
                  </button>
                </div>
                <div className="md:col-span-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Package / Year</label>
                   <div className="grid grid-cols-2 gap-2">
                     <input name="package" placeholder="e.g. 10 LPA" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                     <input name="year" placeholder="2026" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                   </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlacements.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-20 text-center bg-white rounded-[40px] border border-slate-100 text-slate-400 font-medium italic">
            No placement records found.
          </div>
        ) : (
          filteredPlacements.map((p) => (
            <div key={p.id} className="glass-morphism p-8 rounded-[40px] border border-slate-100 bg-white group hover:shadow-xl transition-all relative overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase">
                    {p.studentName.charAt(0)}
                 </div>
                 <button 
                    onClick={async () => { if(confirm("Delete record?")) await deletePlacement(p.id); }}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                 </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 font-outfit">{p.studentName}</h3>
              <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-6">{p.company}</p>
              
              <div className="space-y-3 mb-8 flex-1">
                 <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <Briefcase size={14} className="text-slate-300" />
                    {p.role}
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-900">
                    <Award size={14} className="text-primary" />
                    {p.package || "Placement Confirmed"}
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Calendar size={12} /> Class of {p.year}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
