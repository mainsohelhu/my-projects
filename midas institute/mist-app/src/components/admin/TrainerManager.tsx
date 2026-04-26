"use client";

import { useState, useTransition } from "react";
import { addTrainer, updateTrainer, deleteTrainer } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Plus, X, Edit3, Trash2, Eye, EyeOff, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const F = ({ label, name, defaultValue, placeholder, type = "text", span = false }: any) => (
  <div className={`space-y-1 ${span ? "col-span-2" : ""}`}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {type === "textarea" ? (
      <textarea name={name} defaultValue={defaultValue || ""} placeholder={placeholder || ""}
        rows={4} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium resize-none" />
    ) : (
      <input name={name} defaultValue={defaultValue || ""} placeholder={placeholder || ""} type={type}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
    )}
  </div>
);

function TrainerForm({ trainer, onSave, onCancel, isPending }: any) {
  return (
    <form action={onSave} className="grid grid-cols-2 gap-5 p-8 bg-white rounded-[32px] border border-slate-100 shadow-xl">
      <F label="Full Name *" name="name" defaultValue={trainer?.name} />
      <F label="Role / Title *" name="role" defaultValue={trainer?.role} placeholder="e.g. Full Stack Developer & Trainer" />
      <F label="Experience *" name="experience" defaultValue={trainer?.experience} placeholder="e.g. 8+ Years" />
      <F label="Display Order" name="order" defaultValue={trainer?.order ?? 0} type="number" />
      <F label="Short Bio (shown on homepage) *" name="shortBio" defaultValue={trainer?.shortBio} type="textarea" span />
      <F label="Full Journey / Biography *" name="fullBio" defaultValue={trainer?.fullBio} type="textarea" span />
      <F label="Skills (comma separated)" name="skills" defaultValue={trainer?.skills?.join(", ")} placeholder="React.js, Node.js, Python" span />
      <F label="Photo URL" name="photo" defaultValue={trainer?.photo} placeholder="https://..." />
      <F label="LinkedIn URL" name="linkedin" defaultValue={trainer?.linkedin} placeholder="https://linkedin.com/in/..." />
      <F label="GitHub URL" name="github" defaultValue={trainer?.github} placeholder="https://github.com/..." />
      <div className="col-span-2 flex items-center justify-between pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isVisible" value="true" defaultChecked={trainer ? trainer.isVisible : true} className="w-4 h-4 rounded" />
          <span className="text-sm font-bold text-slate-700">Visible on Website</span>
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
          <button disabled={isPending} className="px-8 py-3 bg-primary text-black font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50">
            {isPending ? <Loader2 className="animate-spin" size={16} /> : trainer ? "Save Changes" : "Add Trainer"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function TrainerManager({ initialTrainers }: { initialTrainers: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<any | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = (fn: () => Promise<any>, onSuccess: () => void) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) setError(res.error);
      else onSuccess();
    });
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <UserCheck size={22} className="text-primary" />
          <span className="font-bold text-slate-900">Faculty & Trainers</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black">{initialTrainers.length} trainers</span>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditingTrainer(null); setError(null); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${isAdding ? "bg-slate-900 text-white" : "bg-primary text-black"}`}>
          {isAdding ? <X size={18} /> : <Plus size={18} />}
          {isAdding ? "Cancel" : "Add Trainer"}
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{error}</div>}

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <h2 className="text-xl font-bold font-outfit text-slate-900 mb-4">Add New Trainer</h2>
            <TrainerForm
              trainer={null}
              isPending={isPending}
              onCancel={() => setIsAdding(false)}
              onSave={(fd: FormData) => handle(() => addTrainer(fd), () => setIsAdding(false))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit form */}
      <AnimatePresence>
        {editingTrainer && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-outfit text-white">Editing: {editingTrainer.name}</h2>
                <button onClick={() => setEditingTrainer(null)} className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30">
                  <X size={20} />
                </button>
              </div>
              <TrainerForm
                trainer={editingTrainer}
                isPending={isPending}
                onCancel={() => setEditingTrainer(null)}
                onSave={(fd: FormData) => handle(() => updateTrainer(editingTrainer.id, fd), () => setEditingTrainer(null))}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trainer cards */}
      <div className="space-y-4">
        {initialTrainers.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 text-slate-400 italic">No trainers yet. Add your first trainer above!</div>
        )}
        {initialTrainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl font-black text-slate-300 overflow-hidden shrink-0">
                {trainer.photo ? <img src={trainer.photo} alt={trainer.name} className="w-full h-full object-cover" /> : trainer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-900 font-outfit text-lg">{trainer.name}</h3>
                  {trainer.isVisible
                    ? <Eye size={14} className="text-green-500" />
                    : <EyeOff size={14} className="text-slate-300" />}
                </div>
                <p className="text-xs font-bold text-primary">{trainer.role}</p>
                <p className="text-xs text-slate-400 mt-1 truncate">{trainer.shortBio}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditingTrainer(trainer)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors" title="Edit"><Edit3 size={18} /></button>
                <button onClick={async () => { if (confirm("Delete trainer?")) await deleteTrainer(trainer.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={18} /></button>
                <button onClick={() => setExpanded(expanded === trainer.id ? null : trainer.id)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  {expanded === trainer.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {expanded === trainer.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-50 bg-[#fafafa]">
                  <div className="p-6 grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Short Bio</p>
                      <p className="text-slate-600">{trainer.shortBio}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">{trainer.skills.map((s: string) => <span key={s} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500">{s}</span>)}</div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Journey (preview)</p>
                      <p className="text-slate-500 text-xs line-clamp-3">{trainer.fullBio}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
