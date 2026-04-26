import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, BookOpen } from "lucide-react";

const DEMO_PHOTOS = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&h=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&h=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&h=800&auto=format&fit=crop",
];

export default async function TrainerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trainer = await prisma.trainer.findUnique({ where: { id } });
  if (!trainer) notFound();

  // Match the demo photo logic from the home page using trainer.order
  const photoIndex = Math.max(0, (trainer.order || 1) - 1) % DEMO_PHOTOS.length;
  const photoUrl = trainer.photo || DEMO_PHOTOS[photoIndex];

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Navbar Spacer */}
      <div className="h-20 md:h-24" />

      {/* Dynamic Cover Banner */}
      <div className="w-full h-[25vh] min-h-[200px] md:h-[30vh] md:min-h-[250px] relative overflow-hidden bg-slate-900 rounded-t-[2.5rem] md:rounded-t-[3rem] mx-auto max-w-[1920px]">
        {/* Blurred background image - Tinted in dark mode to avoid blue glows from attire */}
        <div 
          className="absolute inset-0 opacity-40 blur-2xl scale-110 theme-banner-blur"
          style={{ backgroundImage: `url(${photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-primary/5 theme-banner-overlay" />

        
        {/* Back Link */}
        <div className="absolute top-6 md:top-8 left-4 md:left-8 z-10">
          <Link href="/#trainers" className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors backdrop-blur-md bg-black/20 px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 -mt-16 md:-mt-24">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* Top Profile Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6 md:gap-8 p-6 md:p-12 border-b border-slate-100 relative">
            
            {/* Profile Avatar */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 -mt-20 md:-mt-32 rounded-[2rem] md:rounded-[2.5rem] border-[6px] border-white shadow-xl bg-slate-100 overflow-hidden">
              <img src={photoUrl} alt={trainer.name} className="w-full h-full object-cover object-top" />
            </div>

            {/* Profile Header Info */}
            <div className="flex-1 text-center lg:text-left mt-2 lg:mt-0">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-3">
                {trainer.role}
              </div>
              <h1 className="text-4xl md:text-5xl font-outfit font-bold text-slate-900 mb-2">
                {trainer.name}
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-light">
                {trainer.experience} Experience • Mentor at MIDAS
              </p>
            </div>

            {/* Social Actions */}
            <div className="flex gap-3 mt-4 lg:mt-0 pb-2">
              {trainer.linkedin && (
                <a href={trainer.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-[#0077b5]/10 text-[#0077b5] rounded-full hover:bg-[#0077b5] hover:text-white transition-all shadow-sm">
                  <ExternalLink size={20} />
                </a>
              )}
              {trainer.github && (
                <a href={trainer.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <GitBranch size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Col: Journey & Bio */}
            <div className="flex-1 p-6 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-outfit text-slate-900">About the Journey</h2>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-light leading-relaxed">
                {trainer.fullBio.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-6">{para}</p>
                ))}
              </div>
            </div>

            {/* Right Col: Skills & Stats */}
            <div className="w-full lg:w-[35%] p-6 md:p-12 bg-[#fafcff]">
              
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2 mb-12">
                {trainer.skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm hover:border-primary hover:text-primary transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Quick Stats</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Industry Experience</span>
                  <span className="text-slate-900 font-black">{trainer.experience}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Technologies Mastered</span>
                  <span className="text-slate-900 font-black">{trainer.skills.length}+</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Average Rating</span>
                  <span className="text-slate-900 font-black flex items-center gap-1">5.0 <span className="text-yellow-400 text-lg leading-none">★</span></span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom CTA Area */}
          <div className="p-8 md:p-12 bg-slate-900 text-center relative overflow-hidden rounded-b-[2.5rem] md:rounded-b-[3rem]">
            {/* Decor */}
            <div className="theme-bg-glow absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="theme-bg-glow absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-outfit font-bold text-white mb-4">Learn Directly From {trainer.name.split(" ")[0]}</h3>
              <p className="text-slate-400 mb-8 text-lg font-light">
                Join our upcoming batch to get mentored by industry veterans and accelerate your tech career.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-primary text-black font-black rounded-full hover:scale-105 transition-transform text-lg shadow-xl shadow-primary/20">
                Apply for Next Batch <ArrowLeft className="rotate-180" size={20} />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Spacer */}
      <div className="h-24 md:h-32"></div>
    </main>
  );
}
