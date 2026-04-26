"use client";

import { useState, useTransition } from "react";
import { Users, Plus, Trash2, Briefcase, BadgeCheck, Search, Filter, X, Edit3, Check, UserPlus, Loader2 } from "lucide-react";
import { deleteEmployee, addEmployee } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function EmployeeManager({ initialEmployees }: { initialEmployees: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredEmployees = initialEmployees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || e.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roles = ["Faculty", "Counselor", "Admin", "HR"];
  const allRoles = Array.from(new Set([...roles, ...initialEmployees.map(e => e.role)]));

  const handleAdd = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await addEmployee(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsAdding(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => { setIsAdding(!isAdding); setError(null); }}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            isAdding ? "bg-slate-900 text-white" : "bg-primary text-black"
          }`}
        >
          {isAdding ? <X size={20} /> : <UserPlus size={20} />}
          {isAdding ? "Cancel" : "Add Staff"}
        </button>
      </div>

      {/* Staff Form (Collapsible) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-morphism p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-outfit">Staff Registration</h2>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input name="name" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                  <input name="email" required type="email" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role / Department</label>
                  <div className="flex gap-2">
                    {isCustomRole ? (
                       <input 
                         name="role" 
                         placeholder="Enter Role" 
                         required 
                         className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" 
                       />
                    ) : (
                      <select name="role" required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-bold">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                    <button 
                      type="button" 
                      onClick={() => setIsCustomRole(!isCustomRole)}
                      className="px-4 bg-slate-100 rounded-xl text-[10px] font-black uppercase hover:bg-primary transition-colors shrink-0"
                    >
                      {isCustomRole ? "Pick" : "Custom"}
                    </button>
                  </div>
                </div>
                <div className="flex items-end">
                  <button 
                    disabled={isPending}
                    className="w-full py-3 bg-primary text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : "Register Member"}
                  </button>
                </div>
                <div className="md:col-span-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone (Optional)</label>
                   <input name="phone" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-medium" />
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Table */}
      <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Employee Info</th>
                <th className="px-8 py-6">Department</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    No staff records found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <BadgeCheck size={14} className="text-primary" />
                        {emp.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] text-slate-500 font-medium italic">
                      {new Date(emp.joinDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={async () => { if(confirm("Delete employee?")) await deleteEmployee(emp.id); }}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
