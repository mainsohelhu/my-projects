"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, Loader2, PenTool, Eraser, Sparkles } from "lucide-react";
import { submitLearningLog } from "@/app/actions";

export default function LearningLogForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const [signature, setSignature] = useState("");
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Canvas drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSigned) {
      setSignature(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
    setHasSigned(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!hasSigned) {
      setResult({ error: "Please add your digital signature before submitting." });
      return;
    }

    setResult(null);
    startTransition(async () => {
      const res = await submitLearningLog({ userId: user.id, content, signature });
      if (res.success) {
        setResult({ success: true });
        setContent("");
        clearSignature();
      } else {
        setResult({ error: res.error });
      }
    });
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-10 py-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl font-outfit">What Did I Learn Today?</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        {/* Content Textarea */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} className="text-primary" /> Today's Learning Summary
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            placeholder="Write everything you learned today... topics covered, concepts understood, code you wrote, problems you solved..."
            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[20px] outline-none focus:border-primary text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none transition-all"
          />
          <div className="text-right text-[10px] font-bold text-slate-300">{content.length} characters</div>
        </div>

        {/* Signature Pad */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <PenTool size={12} className="text-primary" /> Digital Signature
            </label>
            <button type="button" onClick={clearSignature} className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors">
              <Eraser size={12} /> Clear
            </button>
          </div>
          <div className={`relative border-2 rounded-2xl overflow-hidden transition-all ${hasSigned ? "border-primary/40 bg-slate-50" : "border-dashed border-slate-200 bg-slate-50"}`} style={{ height: 140 }}>
            <canvas
              ref={canvasRef}
              width={700}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
            {!hasSigned && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sign here</p>
              </div>
            )}
            {hasSigned && (
              <div className="absolute bottom-2 right-3 pointer-events-none">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Signed</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Your signature confirms this is an accurate record of your learning.</p>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${result.success ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
            >
              {result.success ? <CheckCircle2 size={18} /> : "⚠️"}
              {result.success ? "Learning log saved & signed successfully!" : result.error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-primary hover:text-black transition-all active:scale-95 disabled:opacity-40 shadow-xl"
        >
          {isPending ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={20} />}
          {isPending ? "Saving..." : "Submit Today's Log"}
        </button>
      </form>
    </div>
  );
}
