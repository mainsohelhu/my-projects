"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CoursesSection() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] bg-slate-50 animate-pulse rounded-[40px]" />
            ))
          ) : courses.length === 0 ? (
             // Fallback for demo if no DB courses yet
             [
              { title: "Full Stack Development", desc: "Master the complete MERN stack.", duration: "6 Months", price: "₹35,000" },
              { title: "Data Science & AI", desc: "Deep dive into analytics and ML.", duration: "8 Months", price: "₹45,000" },
              { title: "Software Engineering", desc: "Build enterprise-grade applications.", duration: "12 Months", price: "₹55,000" },
             ].map((c, i) => (
              <CourseCard key={i} course={c} index={i} />
             ))
          ) : (
            courses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CourseCard({ course, index }: { course: any, index: number }) {
  // Map titles to our new 3D icons
  const getCourseImage = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("web") || t.includes("full stack") || t.includes("frontend") || t.includes("backend")) return "/course-web.png";
    if (t.includes("ai") || t.includes("artificial") || t.includes("machine") || t.includes("intelligence")) return "/course-ai.png";
    if (t.includes("data") || t.includes("analytics") || t.includes("science")) return "/course-data.png";
    return "/course-web.png"; // fallback
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: index * 0.1 
      }}
      whileHover={{ 
        y: -10,
        rotateX: 2,
        rotateY: 2,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="glass-morphism p-10 rounded-[50px] group border border-slate-200 bg-white flex flex-col transition-all duration-500 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden perspective-1000"
    >
      {/* Dynamic Glow Following (on card, not cursor for simplicity/performance in this view) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="mb-10 relative w-24 h-24">
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: index * 0.7
          }}
          className="relative w-full h-full z-10"
        >
          <Image 
            src={getCourseImage(course.title)} 
            alt={course.title} 
            fill 
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_30px_50px_rgba(var(--color-primary-rgb),0.4)] transition-all"
          />
        </motion.div>
        {/* Shadow/Glow under 3D icon */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/10 blur-xl rounded-full group-hover:bg-primary/30 transition-all" />
      </div>
      
      <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors font-outfit">{course.title}</h3>
      <p className="text-slate-500 text-base leading-relaxed mb-12 flex-1 font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">{course.description || course.desc}</p>
      
      <div className="flex items-center justify-between pt-8 border-t border-slate-100 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
              <Clock size={16} />
            </div>
            {course.duration}
          </div>
          {(course.showPrice !== false && course.price) && (
            <div className="flex items-center gap-2 text-xs text-primary font-black uppercase tracking-widest">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag size={16} />
              </div>
              {course.price}
            </div>
          )}
        </div>
        <Link href={`/courses/${course.id || index}`} className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all shadow-xl hover:scale-110 active:scale-95">
          <ArrowRight size={24} />
        </Link>
      </div>

      {/* Decorative accent for 'attention grabbing' */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
    </motion.div>
  );
}
