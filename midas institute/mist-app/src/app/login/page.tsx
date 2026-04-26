"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, User } from "lucide-react";
import { loginUser } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await loginUser(formData);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,182,34,0.1),transparent)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 p-10 md:p-12 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Log in to your MIST account</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="email@example.com"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all"
              />
            </div>
            <div className="flex justify-end px-1">
              <Link href="/forgot-password" summer-text="Forgot password?" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button 
            disabled={isPending}
            className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : "Log In to Account"}
            {!isPending && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-sm font-bold">
            New to MIST?{" "}
            <Link href="/signup" className="text-primary hover:underline">Create Student Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
