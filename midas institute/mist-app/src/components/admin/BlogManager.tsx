"use client";

import { useState, useTransition } from "react";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon, Layout, User, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { addBlogPost, deleteBlogPost, toggleBlogPublish } from "@/app/actions";

export default function BlogManager({ initialPosts }: { initialPosts: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const router = useRouter();

  const filteredPosts = initialPosts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addBlogPost(formData);
      if (!res.error) {
        setIsModalOpen(false);
        setEditingPost(null);
        router.refresh();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      await deleteBlogPost(id);
      router.refresh();
    });
  };

  const handleToggle = async (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleBlogPublish(id, current);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium"
          />
        </div>
        <button 
          onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
          className="w-full md:w-auto px-8 py-3 bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all"
        >
          <Plus size={20} />
          Write New Article
        </button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">
                {post.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleToggle(post.id, post.published)}
                  className={`p-3 rounded-xl transition-all ${post.published ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button 
                  onClick={() => { setEditingPost(post); setIsModalOpen(true); }}
                  className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all ml-auto"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden">
              <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-outfit">{editingPost ? 'Edit Article' : 'Write New Article'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Title</label>
                    <input name="title" defaultValue={editingPost?.title} required placeholder="e.g. Future of MERN Stack in 2026" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <input name="category" defaultValue={editingPost?.category || "Tech"} required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author Name</label>
                      <input name="author" defaultValue={editingPost?.author || "MIST Team"} required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Feature Image URL</label>
                    <div className="flex gap-4">
                      <input 
                        name="image" 
                        id="blog-image-input"
                        defaultValue={editingPost?.image} 
                        onChange={(e) => {
                          const preview = document.getElementById('blog-image-preview') as HTMLImageElement;
                          if (preview) preview.src = e.target.value || '/course-web.png';
                        }}
                        placeholder="https://images.unsplash.com/..." 
                        className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold" 
                      />
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                        <img 
                          id="blog-image-preview" 
                          src={editingPost?.image || "/course-web.png"} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/course-web.png';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content (Markdown supported)</label>
                    <textarea name="content" defaultValue={editingPost?.content} required rows={8} placeholder="Write your story here..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-medium resize-none" />
                  </div>

                  <button disabled={isPending} className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4">
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : (editingPost ? "Update Article" : "Publish Article")}
                    {!isPending && <Layout size={20} />}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
