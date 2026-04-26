import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="pt-40 pb-24 bg-[#f8fafc] border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
          <span className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4">Latest Insights</span>
          <h1 className="text-5xl md:text-7xl font-outfit font-bold text-slate-900 mb-6 leading-tight">
             MIDAS <span className="text-gradient">Tech Blog</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Stay updated with the latest trends in software technology, placement stories, and expert tutorials from our faculty.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 container mx-auto px-6 md:px-8 flex-1">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-[45px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col">
                <div className="h-72 overflow-hidden relative">
                  <Image 
                    src={post.image || "/course-web.png"} 
                    alt={post.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 shadow-sm flex items-center gap-2 uppercase tracking-widest">
                    <Tag size={12} className="text-primary" />
                    {post.category}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex items-center text-[10px] font-black text-slate-400 mb-6 gap-4 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2 text-primary"><Clock size={14} /> 5 min read</span>
                    <span className="opacity-30">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-10 line-clamp-3 leading-relaxed font-medium">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-xs font-black text-slate-900 hover:text-primary transition-all uppercase tracking-[0.3em] gap-3 group/link">
                      Read Article 
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-black transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50/50 rounded-[60px] border-2 border-dashed border-slate-100">
            <Newspaper size={80} className="mx-auto text-slate-200 mb-8" />
            <h3 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">No Articles Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">We're currently crafting high-quality tech content for you. Check back very soon!</p>
          </div>
        )}
      </section>
    </main>
  );
}
