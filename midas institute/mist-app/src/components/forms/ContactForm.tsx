"use client";

import { useState } from "react";
import { submitEnquiry } from "@/app/actions";
import { Loader2, CheckCircle2, Send, Phone, User, Mail, GraduationCap, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitEnquiry(formData);
    
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Your professional enquiry has been received. A counselor will contact you shortly.");
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 text-left max-w-xl mx-auto mt-12 relative overflow-hidden group">
      {status === "success" ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
            <CheckCircle2 className="text-primary" size={48} />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Application Sent!</h3>
          <p className="text-slate-500 font-medium px-6 leading-relaxed">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 font-outfit">Admissions 2026</h3>
            <p className="text-slate-400 text-xs mt-2 font-black uppercase tracking-[0.3em]">Start Your Professional Journey</p>
          </div>

          {status === "error" && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {message}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input name="name" required type="text" placeholder="Full Name (as per documents)" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input name="phone" required type="tel" placeholder="+91 XXXXX XXXXX" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input name="email" type="email" placeholder="official.email@domain.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-300" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program of Interest</label>
              <div className="relative">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <select name="course" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium appearance-none cursor-pointer">
                  <option value="">-- Choose Specialization --</option>
                  <option value="Full Stack Web Development">Full Stack Web Development</option>
                  <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                  <option value="Python Professional Certification">Python Professional Certification</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Career Objectives</label>
              <div className="relative">
                <MessageSquare className="absolute left-5 top-5 text-slate-300" size={20} />
                <textarea name="message" rows={3} placeholder="Briefly describe your career goals or any specific queries..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-slate-900 font-medium resize-none placeholder:text-slate-300"></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full py-5 bg-black text-white font-bold rounded-2xl hover:bg-primary hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-black/10 text-xl group"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Application
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
