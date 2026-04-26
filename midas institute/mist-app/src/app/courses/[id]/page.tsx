import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Tag, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    const courseBySlug = await prisma.course.findUnique({
      where: { slug: id }
    });
    if (!courseBySlug) notFound();
    return <CourseView course={courseBySlug} />;
  }

  return <CourseView course={course} />;
}

function CourseView({ course }: { course: any }) {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-40 pb-24 bg-[#f8fafc] border-b border-slate-100">
        <div className="container mx-auto px-6 md:px-8">
          <Link href="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-10 transition-colors font-bold text-sm uppercase tracking-widest">
            <ArrowLeft size={18} /> Back to Programs
          </Link>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 border border-primary/20">
              <BookOpen size={14} />
              Professional Certification
            </div>
            <h1 className="text-5xl md:text-7xl font-outfit font-bold mb-8 text-slate-900 leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-light">
              {course.description}
            </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <Clock className="text-primary" size={20} />
                  <span className="font-bold text-slate-900">{course.duration}</span>
                </div>
                {(course.showPrice !== false && course.price) && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <Tag className="text-primary" size={20} />
                    <span className="font-bold text-slate-900">{course.price || "Contact for Pricing"}</span>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* Course Details Content */}
      <div className="container mx-auto px-6 md:px-8 py-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-8">Course Curriculum</h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                Our {course.title} program at Midas Institute is a fully immersive, hands-on experience. 
                You'll work on real-world projects, learn from certified trainers, and prepare for top-tier IT roles. 
                The curriculum is updated every quarter to match industry standards.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold font-outfit text-slate-900 mb-8">What You Will Master</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "Industry-standard tools and frameworks",
                  "Hands-on real-world projects",
                  "Advanced problem-solving techniques",
                  "Best practices and coding standards",
                  "Interview and HR round preparation",
                  "Soft skills and communication"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="text-primary" size={18} />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-200 sticky top-32 bg-white shadow-xl">
              <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-8 text-center">Enrollment Status</h3>
              <p className="text-slate-500 text-center mb-8 text-sm uppercase tracking-widest font-bold">Registration Open for 2026</p>
              
              <Link href="/contact" className="block w-full py-5 bg-black text-white text-center font-bold rounded-2xl hover:bg-primary hover:text-black transition-all hover:scale-105 active:scale-95 mb-4 shadow-xl">
                Apply Now
              </Link>
              <p className="text-center text-[11px] text-slate-400 font-medium">100% Placement Assistance Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
