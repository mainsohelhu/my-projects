"use client";

import { useState } from "react";
import { deleteEnquiry, updateEnquiryStatus } from "@/app/actions";
import { Trash2, PhoneCall, Eye, X, Printer, User, GraduationCap, Briefcase, IndianRupee, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function EnquiryManager({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [loading, setLoading] = useState<string | null>(null);
  const [viewEnquiry, setViewEnquiry] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    setLoading(id);
    const res = await deleteEnquiry(id);
    if (res.success) {
      setEnquiries(enquiries.filter(e => e.id !== id));
      if (viewEnquiry?.id === id) setViewEnquiry(null);
    }
    setLoading(null);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setLoading(id);
    const res = await updateEnquiryStatus(id, status);
    if (res.success) {
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
      if (viewEnquiry?.id === id) setViewEnquiry({ ...viewEnquiry, status });
    }
    setLoading(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enrolled": return "bg-green-100 text-green-700 border-green-200";
      case "Pending Call": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Interested": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
              <th className="py-5 px-6 font-bold">Student / Info</th>
              <th className="py-5 px-6 font-bold">Program</th>
              <th className="py-5 px-6 font-bold">Contact</th>
              <th className="py-5 px-6 font-bold">Status</th>
              <th className="py-5 px-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 italic">No active enquiries found.</td>
              </tr>
            ) : (
              enquiries.map((enq) => (
                <tr key={enq.id} className={`group hover:bg-slate-50/50 transition-all ${loading === enq.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="py-6 px-6">
                    <div className="font-bold text-slate-900 mb-1">{enq.name}</div>
                    <div className="text-xs text-slate-500">{enq.email || "No email provided"}</div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700 border border-slate-200">
                      {enq.course}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <PhoneCall size={14} className="text-primary" />
                      {enq.phone}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <select 
                      value={enq.status}
                      onChange={(e) => handleStatusUpdate(enq.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none appearance-none cursor-pointer ${getStatusColor(enq.status)}`}
                    >
                      <option value="Lead">Lead</option>
                      <option value="Pending Call">Pending Call</option>
                      <option value="Interested">Interested</option>
                      <option value="Enrolled">Enrolled</option>
                      <option value="Not Interested">Not Interested</option>
                    </select>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDelete(enq.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => setViewEnquiry(enq)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all"
                        title="View Full Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Full Enquiry Modal */}
      <AnimatePresence>
        {viewEnquiry && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md print:bg-white print:p-0"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none"
            >
               {/* Header */}
               <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 print:hidden">
                  <div>
                     <h2 className="text-2xl font-bold font-outfit text-slate-900">Enquiry Profile</h2>
                     <p className="text-sm font-medium text-slate-500 mt-1">Submitted on {new Date(viewEnquiry.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary hover:text-black transition-all">
                       <Printer size={16} /> Print / Save as PDF
                     </button>
                     <button onClick={() => setViewEnquiry(null)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm">
                       <X size={20} />
                     </button>
                  </div>
               </div>

               {/* Print Header */}
               <div className="hidden print:flex p-4 border-b border-slate-200 mb-2 items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white border border-slate-100 shadow-sm">
                       <Image src="/logo.jpeg" alt="MIDAS" fill className="object-contain p-1" />
                     </div>
                     <div>
                        <h1 className="text-xl font-bold text-slate-900 font-outfit leading-none">MIDAS INSTITUTE</h1>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Student Enquiry Form</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-slate-900 text-[10px]">Date: {new Date(viewEnquiry.createdAt).toLocaleDateString()}</p>
                     <p className="text-[8px] text-slate-500 font-mono">Ref: {viewEnquiry.id}</p>
                  </div>
               </div>

               {/* Body */}
               <div className="p-8 print:p-4 print:py-0 overflow-y-auto custom-scrollbar flex-1 print:overflow-visible">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 print:grid-cols-2 print:gap-x-6 print:gap-y-3">
                     
                     {/* Personal Info */}
                     <div className="space-y-6 print:space-y-1">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 print:pb-1">
                           <User size={16} className="text-slate-400 print:text-slate-600 print:w-3 print:h-3" />
                           <h3 className="text-[11px] print:text-[9px] font-black text-slate-400 print:text-slate-600 uppercase tracking-widest">Personal Details</h3>
                        </div>
                        <div className="space-y-4 print:space-y-1">
                           <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Full Name</span><span className="font-bold text-slate-900 text-lg print:text-xs leading-none">{viewEnquiry.name}</span></div>
                           <div className="grid grid-cols-2 gap-4 print:gap-1">
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Phone</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.phone}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Email</span><span className="font-medium text-slate-700 text-sm print:text-[9px] break-all">{viewEnquiry.email || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Gender</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.gender || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Date of Birth</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.dob || "N/A"}</span></div>
                           </div>
                           <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">City / State</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.cityState || "N/A"}</span></div>
                        </div>
                     </div>

                     {/* Academic Info */}
                     <div className="space-y-6 print:space-y-1">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 print:pb-1">
                           <GraduationCap size={16} className="text-slate-400 print:text-slate-600 print:w-3 print:h-3" />
                           <h3 className="text-[11px] print:text-[9px] font-black text-slate-400 print:text-slate-600 uppercase tracking-widest">Academic Background</h3>
                        </div>
                        <div className="space-y-4 print:space-y-1">
                           <div className="grid grid-cols-2 gap-4 print:gap-1">
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Qualification</span><span className="font-bold text-slate-900 text-sm print:text-[9px]">{viewEnquiry.qualification || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Stream</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.stream || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Passing Year</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.passingYear || "N/A"}</span></div>
                           </div>
                           <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">College / School</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.college || "N/A"}</span></div>
                        </div>
                     </div>

                     {/* Course & Intent */}
                     <div className="space-y-6 print:space-y-1">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 print:pb-1">
                           <Briefcase size={16} className="text-slate-400 print:text-slate-600 print:w-3 print:h-3" />
                           <h3 className="text-[11px] print:text-[9px] font-black text-slate-400 print:text-slate-600 uppercase tracking-widest">Course & Career Intent</h3>
                        </div>
                        <div className="space-y-4 print:space-y-1">
                           <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Interested Course</span><span className="font-bold text-slate-900 print:text-black text-lg print:text-[10px] leading-none">{viewEnquiry.course}</span></div>
                           <div className="grid grid-cols-2 gap-4 print:gap-1">
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Mode</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.mode || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Timing</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.timing || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Primary Goal</span><span className="font-bold text-slate-900 text-sm print:text-[9px]">{viewEnquiry.goal || "N/A"}</span></div>
                           </div>
                           <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Why join this course?</span><span className="font-medium text-slate-700 italic text-sm print:text-[9px]">{viewEnquiry.reason || "N/A"}</span></div>
                           <div className="bg-slate-50 print:bg-transparent print:p-0 p-4 rounded-2xl">
                             <span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block mb-1">Prior Experience</span>
                             <div className="font-medium text-slate-700 text-sm print:text-[9px]">Knowledge: <span className="font-bold">{viewEnquiry.priorKnowledge || "N/A"}</span></div>
                             {viewEnquiry.priorKnowledge === "Yes" && <div className="font-medium text-slate-700 mt-1 text-sm print:text-[9px]">Skills: {viewEnquiry.skills || "N/A"}</div>}
                           </div>
                        </div>
                     </div>

                     {/* Commitment & Source */}
                     <div className="space-y-6 print:space-y-1">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 print:pb-1">
                           <IndianRupee size={16} className="text-slate-400 print:text-slate-600 print:w-3 print:h-3" />
                           <h3 className="text-[11px] print:text-[9px] font-black text-slate-400 print:text-slate-600 uppercase tracking-widest">Commitment & Notes</h3>
                        </div>
                        <div className="space-y-4 print:space-y-1">
                           <div className="grid grid-cols-2 gap-4 print:gap-1">
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Budget</span><span className="font-bold text-slate-900 text-sm print:text-[9px]">{viewEnquiry.budget || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Start Timeline</span><span className="font-bold text-slate-900 text-sm print:text-[9px]">{viewEnquiry.startTime || "N/A"}</span></div>
                             <div><span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block">Source</span><span className="font-medium text-slate-700 text-sm print:text-[9px]">{viewEnquiry.source || "N/A"}</span></div>
                           </div>
                           <div>
                              <span className="text-[9px] print:text-[7px] text-slate-400 uppercase tracking-widest font-black block mb-1">Additional Message</span>
                              <div className="p-4 print:p-0 bg-slate-50 print:bg-transparent rounded-2xl print:border-none border border-slate-100 text-sm print:text-[9px] text-slate-600 italic">
                                 {viewEnquiry.message || "No additional message provided."}
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

               {/* Print Footer / Signature Block */}
               <div className="hidden print:block p-4 mt-1">
                  <div className="flex justify-between items-end mt-4 mb-2 px-10">
                     <div className="text-center">
                        {viewEnquiry.signature ? (
                          <div className="flex justify-center mb-1 h-8 items-end">
                            <img src={viewEnquiry.signature} alt="Digital Signature" className="h-8 object-contain" />
                          </div>
                        ) : (
                          <div className="w-40 h-[1px] bg-slate-400 mb-1 mx-auto mt-8"></div>
                        )}
                        <div className="w-40 h-[1px] bg-slate-900 mb-1 mx-auto"></div>
                        <p className="text-[8px] text-slate-900 uppercase font-bold tracking-widest">Student Signature</p>
                     </div>
                     <div className="text-center">
                        <div className="w-40 h-[1px] bg-slate-400 mb-1 mx-auto mt-8"></div>
                        <p className="text-[8px] text-slate-900 uppercase font-bold tracking-widest">Counselor Signature</p>
                     </div>
                  </div>
                  <p className="text-[7px] text-slate-400 italic font-medium text-center border-t border-slate-100 pt-2 mt-4">
                    This is a system generated document. Midas Institute of Software Technology. All rights reserved.
                  </p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0, .fixed.inset-0 * { visibility: visible; }
          .fixed.inset-0 { position: absolute; left: 0; top: 0; transform: none !important; }
        }
      `}} />
    </>
  );
}
