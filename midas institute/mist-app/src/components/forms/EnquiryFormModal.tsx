"use client";

import { useState, useRef, useEffect } from "react";
import { submitEnquiry } from "@/app/actions";
import { X, CheckCircle, ChevronRight, User, GraduationCap, Briefcase, BookOpen, IndianRupee, Loader2, Eraser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_FORM_STATE = {
  name: "", gender: "", dob: "", phone: "", email: "", cityState: "",
  qualification: "", stream: "", college: "", passingYear: "",
  course: "", mode: "", timing: "",
  reason: "", goal: "",
  priorKnowledge: "", skills: "",
  budget: "", startTime: "",
  source: "", message: "", consent: false
};

export default function EnquiryFormModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  // Signature State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSignature(true);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.phone || !formData.email || !formData.cityState)) {
      setError("Please fill all required fields marked with *");
      return;
    }
    if (step === 2 && !formData.qualification) {
      setError("Please select your current qualification.");
      return;
    }
    if (step === 3 && !formData.course) {
      setError("Please select a course you are interested in.");
      return;
    }
    setError(null);
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setError("You must agree to be contacted.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value.toString()));

    if (hasSignature && canvasRef.current) {
      fd.append("signature", canvasRef.current.toDataURL("image/png"));
    }

    const res = await submitEnquiry(fd);
    setIsSubmitting(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        setFormData(INITIAL_FORM_STATE);
        clearSignature();
        onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
             <div>
                <h2 className="text-2xl font-bold font-outfit text-slate-900">Career Counseling Form</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Step {step} of 4: {
                  step === 1 ? "Personal Details" : 
                  step === 2 ? "Academic Profile" : 
                  step === 3 ? "Course & Intent" : "Final Details"
                }</p>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm">
                <X size={20} />
             </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
             {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   {error}
                </div>
             )}

             {isSuccess ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-6">
                      <CheckCircle size={48} />
                   </div>
                   <h3 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Application Received!</h3>
                   <p className="text-slate-500 font-medium">Our career counselor will contact you shortly.</p>
                </div>
             ) : (
                <form id="enquiry-form" onSubmit={handleSubmit} className="space-y-8">
                   
                   {/* STEP 1: Basic Info */}
                   {step === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 text-slate-400 mb-6">
                           <User size={20} className="text-primary" />
                           <span className="font-bold uppercase tracking-widest text-xs">1. Basic Information</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                             <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                             <input name="phone" value={formData.phone} onChange={handleChange} required type="tel" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                             <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / State *</label>
                             <input name="cityState" value={formData.cityState} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                             <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                               <option value="">Select Gender</option>
                               <option value="Male">Male</option>
                               <option value="Female">Female</option>
                               <option value="Other">Other</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                             <input name="dob" value={formData.dob} onChange={handleChange} type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold text-slate-500" />
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 2: Academic & Experience */}
                   {step === 2 && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-slate-400 mb-6">
                              <GraduationCap size={20} className="text-primary" />
                              <span className="font-bold uppercase tracking-widest text-xs">2. Academic Details</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Qualification *</label>
                                <select name="qualification" value={formData.qualification} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Qualification</option>
                                  <option value="10th">10th</option>
                                  <option value="12th">12th</option>
                                  <option value="Diploma">Diploma</option>
                                  <option value="Graduate">Graduate</option>
                                  <option value="Post Graduate">Post Graduate</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stream / Subject</label>
                                <input name="stream" value={formData.stream} onChange={handleChange} placeholder="Select your major / stream" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School / College Name</label>
                                <input name="college" value={formData.college} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Year of Passing</label>
                                <input name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="YYYY" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                           <div className="flex items-center gap-3 text-slate-400 mb-6">
                              <Briefcase size={20} className="text-primary" />
                              <span className="font-bold uppercase tracking-widest text-xs">3. Experience Level</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prior IT Knowledge?</label>
                                <select name="priorKnowledge" value={formData.priorKnowledge} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Option</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">If Yes, mention skills</label>
                                <input name="skills" value={formData.skills} onChange={handleChange} placeholder="List any software or programming skills" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" disabled={formData.priorKnowledge !== "Yes"} />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 3: Course & Intent */}
                   {step === 3 && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 text-slate-400 mb-6">
                              <BookOpen size={20} className="text-primary" />
                              <span className="font-bold uppercase tracking-widest text-xs">4. Course Interest</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Interested In *</label>
                                <select name="course" value={formData.course} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Course</option>
                                  <option value="Web Development">Web Development</option>
                                  <option value="App Development">App Development</option>
                                  <option value="Data Science">Data Science</option>
                                  <option value="AI / ML">AI / ML</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Mode</label>
                                <select name="mode" value={formData.mode} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Mode</option>
                                  <option value="Offline">Offline (Campus)</option>
                                  <option value="Online">Online (Live)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Timing</label>
                                <select name="timing" value={formData.timing} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Timing</option>
                                  <option value="Morning">Morning Batch</option>
                                  <option value="Afternoon">Afternoon Batch</option>
                                  <option value="Evening">Evening Batch</option>
                                </select>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-100">
                           <div className="flex items-center gap-3 text-slate-400 mb-6">
                              <User size={20} className="text-primary" />
                              <span className="font-bold uppercase tracking-widest text-xs">5. Career Intent</span>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Goal</label>
                                <select name="goal" value={formData.goal} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                  <option value="">Select Goal</option>
                                  <option value="Job">Get an IT Job</option>
                                  <option value="Freelancing">Freelancing</option>
                                  <option value="Business">Start a Business</option>
                                  <option value="Skill Learning">Skill Upgrade</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Why do you want to join?</label>
                                <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Describe your motivation to join this field" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {/* STEP 4: Final Details */}
                   {step === 4 && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-slate-400 mb-6">
                                 <IndianRupee size={20} className="text-primary" />
                                 <span className="font-bold uppercase tracking-widest text-xs">6. Commitment</span>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Range</label>
                                   <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                     <option value="">Select Budget</option>
                                     <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                                     <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000</option>
                                     <option value="₹25,000+">₹25,000+</option>
                                   </select>
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">When to start?</label>
                                   <select name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                     <option value="">Select Timeline</option>
                                     <option value="Immediately">Immediately</option>
                                     <option value="Within 1 Month">Within 1 Month</option>
                                     <option value="Later">Later</option>
                                   </select>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="flex items-center gap-3 text-slate-400 mb-6">
                                 <CheckCircle size={20} className="text-primary" />
                                 <span className="font-bold uppercase tracking-widest text-xs">7. Final Step</span>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How did you hear about us?</label>
                                   <select name="source" value={formData.source} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold appearance-none">
                                     <option value="Website">Select Source</option>
                                     <option value="Instagram">Instagram</option>
                                     <option value="YouTube">YouTube</option>
                                     <option value="Google">Google Search</option>
                                     <option value="Friend">Friend / Referral</option>
                                     <option value="Ads">Advertisements</option>
                                   </select>
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Questions / Notes</label>
                                   <input name="message" value={formData.message} onChange={handleChange} placeholder="Any specific doubts?" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all text-sm font-bold" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                           <div className="mb-4">
                             <div className="flex items-center justify-between mb-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Signature *</label>
                               <button type="button" onClick={clearSignature} className="text-[10px] flex items-center gap-1 font-bold text-slate-500 hover:text-red-500 transition-colors">
                                 <Eraser size={12} /> Clear
                               </button>
                             </div>
                             <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 overflow-hidden touch-none relative">
                               <canvas 
                                 ref={canvasRef} 
                                 width={600} 
                                 height={150} 
                                 className="w-full h-[150px] cursor-crosshair"
                                 onMouseDown={startDrawing}
                                 onMouseMove={draw}
                                 onMouseUp={stopDrawing}
                                 onMouseOut={stopDrawing}
                                 onTouchStart={startDrawing}
                                 onTouchMove={draw}
                                 onTouchEnd={stopDrawing}
                               />
                               {!hasSignature && (
                                 <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 font-bold text-sm italic">
                                   Sign here
                                 </div>
                               )}
                             </div>
                           </div>

                           <div className="flex gap-3 items-start mt-6">
                              <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary accent-primary" />
                              <label htmlFor="consent" className="text-sm text-slate-600 font-medium">
                                 ✅ I agree to be contacted via call, WhatsApp, or email by Midas Institute regarding my career inquiry.
                              </label>
                           </div>
                        </div>
                     </div>
                   )}
                </form>
             )}
          </div>

          {/* Footer */}
          {!isSuccess && (
             <div className="p-8 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center justify-between">
                <div>
                   {step > 1 && (
                      <button onClick={prevStep} type="button" className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                         ← Back
                      </button>
                   )}
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex gap-2 mr-4">
                      {[1, 2, 3, 4].map(i => (
                         <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-primary w-6" : i < step ? "bg-slate-400" : "bg-slate-200"}`} />
                      ))}
                   </div>
                   {step < 4 ? (
                      <button onClick={nextStep} type="button" className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary hover:text-black transition-all shadow-xl hover:shadow-primary/20">
                         Next Step <ChevronRight size={18} />
                      </button>
                   ) : (
                      <button form="enquiry-form" type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-4 bg-primary text-black rounded-2xl font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                         {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Application"}
                      </button>
                   )}
                </div>
             </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
