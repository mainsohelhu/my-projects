"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ShieldCheck, GraduationCap, Briefcase } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactFormSection() {
  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left side: Professional Info */}
            <div className="space-y-12">
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-primary text-sm font-bold uppercase tracking-[0.3em] block mb-4"
                >
                  Admissions Open 2026
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight font-outfit"
                >
                  Start Your <br /> <span className="text-gradient">Professional Career.</span>
                </motion.h2>
                <p className="text-slate-500 text-lg md:text-xl font-light max-w-md leading-relaxed">
                  Join Raipur's leading IT Institute. Get industry-standard certification and guaranteed placement assistance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-700">Certified Training</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-700">100% Placement</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                    <Briefcase size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-700">MNC Partnerships</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-primary">
                    <Phone size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-700">Expert Support</div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-primary"><MapPin size={20} /></div>
                  <span className="text-slate-600 font-medium">Tatyapara Chowk, Raipur (C.G.)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-primary"><Phone size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-bold">+91 62668 46474</span>
                    <span className="text-slate-900 font-bold">+91 70008 82359</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Professional Form Component */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
