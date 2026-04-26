import CoursesSection from "@/components/home/CoursesSection";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-slate-100 bg-[#f8fafc]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <BookOpen size={14} className="absolute text-primary opacity-30 blur-sm translate-y-0.5" />
              <BookOpen size={14} className="relative text-primary" />
            </div>
            Academic Catalog
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-outfit mb-6 text-slate-900">
            Industry Ready <span className="text-gradient">Programs</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Master the skills that top tech companies are looking for. Our curriculum is strictly designed based on current industry demands.
          </p>
        </div>
      </section>

      <CoursesSection />
    </main>
  );
}
