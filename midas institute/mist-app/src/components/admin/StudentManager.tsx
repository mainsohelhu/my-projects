"use client";

import { useState, useTransition } from "react";
import { GraduationCap, Trash2, UserPlus, Phone, Home, Search, X, Edit3, Loader2, IndianRupee, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { deleteStudent, addStudent, addTransaction, addExistingStudentToCourse, updateStudent } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

const Field = ({ label, name, defaultValue, placeholder, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input name={name} defaultValue={defaultValue || ""} placeholder={placeholder || ""} type={type}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
  </div>
);

export default function StudentManager({ initialStudents, courses }: { initialStudents: any[], courses: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState<{ studentId: string, enrollmentId: string } | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredStudents = initialStudents.filter(s =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (s.phone || "").includes(searchTerm)
  );

  const withFeedback = (fn: () => Promise<{ error?: string; success?: boolean }>, successText: string) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) { setError(res.error); }
      else { setSuccessMsg(successText); setTimeout(() => setSuccessMsg(null), 3000); }
    });
  };

  const handleEnroll = async (formData: FormData) =>
    withFeedback(async () => { const r = await addStudent(formData); if (r.success) setIsAdding(false); return r; }, "Student registered!");

  const handleUpdate = async (formData: FormData) => {
    if (!editingStudent) return;
    withFeedback(async () => { const r = await updateStudent(editingStudent.id, formData); if (r.success) setEditingStudent(null); return r; }, "Student updated!");
  };

  const handleAddCourse = async (formData: FormData) => {
    if (!isAddingCourse) return;
    withFeedback(async () => { const r = await addExistingStudentToCourse(isAddingCourse, formData); if (r.success) setIsAddingCourse(null); return r; }, "Course added!");
  };

  const handlePayment = async (formData: FormData) =>
    withFeedback(async () => { const r = await addTransaction(formData); if (r.success) setIsPaying(null); return r; }, "Payment recorded!");

  return (
    <div className="space-y-8">
      {/* Search + Action Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search by name or phone..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium" />
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setError(null); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${isAdding ? "bg-slate-900 text-white" : "bg-primary text-black"}`}>
          {isAdding ? <X size={20} /> : <UserPlus size={20} />}
          {isAdding ? "Cancel" : "New Student"}
        </button>
      </div>

      {/* Global feedback */}
      <AnimatePresence>
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{error}</motion.div>}
        {successMsg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 flex items-center gap-2"><CheckCircle size={16} />{successMsg}</motion.div>}
      </AnimatePresence>

      {/* Add Student Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-outfit">Full Profile Registration</h2>
              <form action={handleEnroll} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">Personal</h4>
                  <Field label="Full Name *" name="name" />
                  <Field label="Email" name="email" type="email" />
                  <Field label="Home Address" name="address" />
                  <Field label="City / State" name="cityState" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">Contact & Guardian</h4>
                  <Field label="Primary Phone *" name="phone" />
                  <Field label="Guardian Phone" name="alternatePhone" />
                  <Field label="Guardian Name" name="guardianName" placeholder="Father/Mother/Guardian" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">First Enrollment</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Program *</label>
                    <select name="courseId" required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-bold">
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <Field label="Total Course Fee (₹)" name="totalFees" type="number" />
                  <button disabled={isPending} className="w-full py-4 bg-primary text-black font-bold rounded-xl shadow-lg flex items-center justify-center mt-4 disabled:opacity-50">
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : "Finalize Registration"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-bold font-outfit text-slate-900">Edit Student Profile</h2>
                  <p className="text-sm text-slate-400 mt-1">{editingStudent.name}</p>
                </div>
                <button onClick={() => setEditingStudent(null)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <form action={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Personal Details</h4>
                    <Field label="Full Name *" name="name" defaultValue={editingStudent.name} />
                    <Field label="Email" name="email" defaultValue={editingStudent.email} type="email" />
                    <Field label="Home Address" name="address" defaultValue={editingStudent.address} />
                    <Field label="City / State" name="cityState" defaultValue={editingStudent.cityState} />
                    <Field label="Qualification" name="qualification" defaultValue={editingStudent.qualification} />
                    <Field label="Stream / Subject" name="stream" defaultValue={editingStudent.stream} />
                    <Field label="College / School" name="college" defaultValue={editingStudent.college} />
                    <Field label="Passing Year" name="passingYear" defaultValue={editingStudent.passingYear} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Contact & Guardian</h4>
                    <Field label="Primary Phone *" name="phone" defaultValue={editingStudent.phone} />
                    <Field label="Guardian Phone" name="alternatePhone" defaultValue={editingStudent.alternatePhone} />
                    <Field label="Guardian Name" name="guardianName" defaultValue={editingStudent.guardianName} />
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mt-4">Career Profile</h4>
                    <Field label="Goal" name="goal" defaultValue={editingStudent.goal} placeholder="Job / Freelancing / Business" />
                    <Field label="Skills" name="skills" defaultValue={editingStudent.skills} placeholder="HTML, CSS, React..." />
                  </div>
                  <div className="md:col-span-2 flex gap-4 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">
                      Cancel
                    </button>
                    <button disabled={isPending} className="flex-1 py-3 bg-primary text-black font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                      {isPending ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-[40px] max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsPaying(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-outfit text-center">Record Payment</h3>
              <form action={handlePayment} className="space-y-6">
                <input type="hidden" name="enrollmentId" value={isPaying.enrollmentId} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount (₹)</label>
                  <input name="amount" type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-lg font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                  <select name="method" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold">
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note (optional)</label>
                  <input name="note" placeholder="e.g. First installment" className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <button disabled={isPending} className="w-full py-5 bg-black text-white font-bold rounded-2xl flex items-center justify-center gap-3">
                  {isPending ? <Loader2 className="animate-spin" size={24} /> : "Record Transaction"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Course Modal */}
      <AnimatePresence>
        {isAddingCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-10 rounded-[40px] max-w-md w-full shadow-2xl relative">
              <button onClick={() => setIsAddingCourse(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24} /></button>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-outfit text-center">Enroll in New Course</h3>
              <form action={handleAddCourse} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Program</label>
                  <select name="courseId" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Fee (₹)</label>
                  <input name="totalFees" type="number" required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold" />
                </div>
                <button disabled={isPending} className="w-full py-5 bg-primary text-black font-bold rounded-2xl">
                  {isPending ? <Loader2 className="animate-spin" size={24} /> : "Add to Student Profile"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 text-slate-400 italic">No students found.</div>
        )}
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 font-bold text-2xl uppercase">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-outfit">{student.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Phone size={12} /> {student.phone}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Home size={12} /> {student.address || "No Address"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditingStudent(student)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all" title="Edit Student">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => setIsAddingCourse(student.id)} className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                  + Add Course
                </button>
                <button onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
                  {expandedStudent === student.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedStudent === student.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-50 bg-[#fafafa]">
                  <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Enrollments */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Enrollments</h4>
                        {student.enrollments.length === 0 && <p className="text-sm text-slate-400 italic">No enrollments yet.</p>}
                        {student.enrollments.map((en: any) => {
                          const remaining = en.totalFees - en.feesPaid;
                          const pct = en.totalFees > 0 ? Math.round((en.feesPaid / en.totalFees) * 100) : 0;
                          return (
                            <div key={en.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-slate-900">{en.course.title}</p>
                                <button onClick={() => setIsPaying({ studentId: student.id, enrollmentId: en.id })}
                                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-black transition-all text-xs font-black flex items-center gap-1">
                                  <IndianRupee size={14} /> Pay
                                </button>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <div className="flex justify-between text-[10px] font-black text-slate-400">
                                <span>PAID: ₹{en.feesPaid.toLocaleString()}</span>
                                <span className={remaining > 0 ? "text-primary" : "text-green-500"}>
                                  {remaining > 0 ? `DUE: ₹${remaining.toLocaleString()}` : "✓ FULLY PAID"}
                                </span>
                                <span>TOTAL: ₹{en.totalFees.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Guardian & Delete */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guardian Information</h4>
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 italic">Guardian Name:</span>
                            <span className="font-bold text-slate-900">{student.guardianName || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 italic">Alt. Contact:</span>
                            <span className="font-bold text-slate-900">{student.alternatePhone || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 italic">Email:</span>
                            <span className="font-bold text-slate-900 break-all">{student.email || "N/A"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 italic">City / State:</span>
                            <span className="font-bold text-slate-900">{student.cityState || "N/A"}</span>
                          </div>
                          <div className="pt-4 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setEditingStudent(student)}
                              className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-slate-700 transition-all">
                              <Edit3 size={12} /> Edit Profile
                            </button>
                            <button onClick={async () => { if (confirm("Permanently delete student?")) await deleteStudent(student.id); }}
                              className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
