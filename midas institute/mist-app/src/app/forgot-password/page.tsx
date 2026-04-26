"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Key, CheckCircle2, ShieldCheck } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/app/actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1); // 1: Email, 2: Token + Password
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    setEmail(emailVal);
    setMessage(null);

    startTransition(async () => {
      const res = await requestPasswordReset(emailVal);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setStep(2);
        setMessage({ type: 'success', text: "Verification code sent to your email!" });
      }
    });
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("email", email);
    setMessage(null);

    startTransition(async () => {
      const res = await resetPassword(formData);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setStep(3); // Success
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,182,34,0.1),transparent)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 p-10 md:p-12 border border-slate-100 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <Key size={32} />
                </div>
                <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-2">Forgot Password?</h1>
                <p className="text-slate-500 font-medium">Enter your email to receive a recovery code</p>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl mb-6 text-sm font-bold border text-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="email" type="email" required placeholder="your@email.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all" />
                  </div>
                </div>
                <button disabled={isPending} className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : "Send Code"}
                  {!isPending && <ArrowRight size={20} />}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-2">Reset Password</h1>
                <p className="text-slate-500 font-medium">Enter the 6-digit code sent to your email</p>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl mb-6 text-sm font-bold border text-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recovery Code</label>
                  <input name="token" type="text" maxLength={6} required placeholder="000000" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-center text-2xl font-black tracking-[10px] transition-all placeholder:tracking-normal placeholder:text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="password" type="password" required placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all" />
                  </div>
                </div>
                <button disabled={isPending} className="w-full py-5 bg-black text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50">
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
                  {!isPending && <CheckCircle2 size={20} />}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-3xl font-bold font-outfit text-slate-900 mb-4">Success!</h1>
              <p className="text-slate-500 mb-10 font-medium">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link href="/login" className="inline-flex items-center justify-center w-full py-5 bg-black text-white font-black rounded-2xl hover:bg-primary hover:text-black transition-all">
                Go to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== 3 && (
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <Link href="/login" className="text-slate-500 text-sm font-bold hover:text-primary transition-colors">
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
