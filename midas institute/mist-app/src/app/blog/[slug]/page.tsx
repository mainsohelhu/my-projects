import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Share2, Bookmark, ArrowLeft } from "lucide-react";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Pushed down by navbar */}
      <div className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        <div className="relative container mx-auto px-6 md:px-8">
          <div className="max-w-4xl">
            <div className="px-4 py-1 bg-primary text-black inline-block rounded-lg text-[10px] font-black uppercase tracking-widest mb-8">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-7xl font-black font-outfit text-white leading-[1.1] mb-10 tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-300 font-bold text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <User size={20} />
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 md:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Main Article Content */}
          <div className="flex-1 max-w-4xl">
            <div className="prose prose-slate prose-xl max-w-none font-medium text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <button className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-primary group">
                  <Share2 size={24} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-slate-400 hover:text-primary group">
                  <Bookmark size={24} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-3 text-sm font-black text-slate-900 hover:text-primary transition-all uppercase tracking-widest">
                Explore more insights <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-12">
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">About the Institute</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  MIDAS Institute is Central India's leading hub for advanced IT training and professional development.
                </p>
                <Link href="/enroll" className="flex items-center justify-center w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all">
                  Apply Now
                </Link>
              </div>
              
              <div className="px-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Navigation</h4>
                <div className="flex flex-col gap-5">
                  <Link href="/courses" className="text-sm font-bold text-slate-900 hover:text-primary transition-all flex items-center justify-between group">
                    Our Programs <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link href="/placements" className="text-sm font-bold text-slate-900 hover:text-primary transition-all flex items-center justify-between group">
                    Placements <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link href="/contact" className="text-sm font-bold text-slate-900 hover:text-primary transition-all flex items-center justify-between group">
                    Get in Touch <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
