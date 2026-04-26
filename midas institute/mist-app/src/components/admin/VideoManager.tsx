"use client";

import { useState, useTransition } from "react";
import { Play, Plus, Trash2, Search, X, Loader2, Video as VideoIcon } from "lucide-react";
import { addVideo, deleteVideo } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoManager({ initialVideos }: { initialVideos: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredVideos = initialVideos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addVideo(formData);
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
            placeholder="Search videos..." 
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
          {isAdding ? "Cancel" : "Add Video"}
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
              <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-8">Add New Video</h2>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video Title *</label>
                  <input name="title" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">YouTube/Vimeo Embed URL *</label>
                  <input name="url" required placeholder="https://www.youtube.com/embed/..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thumbnail URL</label>
                  <input name="thumbnail" placeholder="Unsplash or Image URL" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Order</label>
                  <input name="order" type="number" defaultValue="0" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="flex items-center gap-4 md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isVisible" value="true" defaultChecked className="w-4 h-4 text-primary rounded border-slate-300" />
                    <span className="text-sm font-bold text-slate-600">Visible on Site</span>
                  </label>
                  <button 
                    disabled={isPending}
                    className="ml-auto px-10 py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : "Publish Video"}
                  </button>
                </div>
              </form>
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Supported Link Formats</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-500 font-medium">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-primary font-bold block mb-1">YouTube</span>
                    Normal URL or "Share" link works.
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-pink-500 font-bold block mb-1">Instagram</span>
                    Paste the Post or Reel URL directly.
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-blue-500 font-bold block mb-1">Google Drive</span>
                    Use the "Share" link (must be Public).
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group">
            <div className="aspect-video rounded-2xl bg-slate-100 mb-4 overflow-hidden relative">
              {video.thumbnail ? (
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <VideoIcon size={48} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                <Play className="text-white" size={32} fill="currentColor" />
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{video.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order: {video.order}</p>
              </div>
              <button 
                onClick={async () => { if(confirm("Delete?")) await deleteVideo(video.id); }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
