"use client";
import { motion } from "framer-motion";
import { Check, UserCheck, MessageSquare, Briefcase } from "lucide-react";

const skillCategories = [
  { 
    title: "Communication", 
    icon: MessageSquare, 
    color: "#06b6d4",
    items: ["Telephonic Conversation Skills", "Grammar & Vocabulary", "Group Discussions", "About Yourself Introductions"]
  },
  { 
    title: "Professionalism", 
    icon: Briefcase, 
    color: "#3b82f6",
    items: ["Resume Writing", "Report & Business Email Writing", "Presentation Skills", "Office Etiquette & Attire"]
  },
  { 
    title: "Interview Prep", 
    icon: UserCheck, 
    color: "#8b5cf6",
    items: ["Different Rounds of Interview", "Mock Interviews", "Personal Interview Prep", "Post-Interview Follow-up"]
  }
];

export default function SoftSkillsSection() {
  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4"
          >
            Holistic Development
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Master the <span className="text-gradient">HR Round</span>
          </motion.h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
            We don't just teach code. We groom you for the professional world with our intensive communication and soft skills training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-morphism p-10 rounded-[50px] relative group border border-slate-200 bg-white hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl"
            >
              {/* 3D Animated Icon Stack */}
              <div className="relative w-20 h-20 mb-10">
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotateY: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: idx * 0.5
                  }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <category.icon 
                    size={48} 
                    className="absolute text-primary opacity-20 blur-md translate-y-2 translate-x-1" 
                  />
                  <category.icon 
                    size={48} 
                    className="absolute text-slate-100 translate-y-1 translate-x-0.5" 
                  />
                  <category.icon 
                    size={48} 
                    className="relative text-primary drop-shadow-xl group-hover:scale-110 transition-transform duration-500" 
                  />
                </motion.div>
                
                {/* Under-glow */}
                <div 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 blur-md rounded-full opacity-0 group-hover:opacity-40 transition-opacity"
                  style={{ background: category.color }}
                />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-8 group-hover:text-primary transition-colors">{category.title}</h3>
              <ul className="space-y-4">
                {category.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-500 group-hover:text-slate-900 transition-colors font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
