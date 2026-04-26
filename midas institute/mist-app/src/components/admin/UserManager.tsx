"use client";

import { useState, useTransition } from "react";
import { Search, Shield, User as UserIcon, CheckCircle2, X, Loader2, Key } from "lucide-react";
import { assignStudentId, updateAdminPermissions } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserManager({ initialUsers }: { initialUsers: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>("STUDENT");
  const router = useRouter();

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const filteredUsers = initialUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async (formData: FormData) => {
    if (!editingUser) return;
    const studentId = formData.get("studentId") as string;
    const role = formData.get("role") as any;
    const permissions = formData.getAll("permissions") as string[];

    startTransition(async () => {
      if (studentId !== editingUser.studentId) {
        await assignStudentId(editingUser.id, studentId);
      }
      await updateAdminPermissions(editingUser.id, permissions, role);
      setEditingUser(null);
      router.refresh();
    });
  };

  const allPermissions = ["courses", "videos", "reviews", "billing", "users", "trainers", "placements", "employees"];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name, email or Student ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-600' : user.role === 'ADMIN' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                {user.role === 'STUDENT' ? <UserIcon size={24} /> : <Shield size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{user.name}</h3>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Role</span>
                <span className={user.role === 'SUPER_ADMIN' ? 'text-purple-600' : user.role === 'ADMIN' ? 'text-blue-600' : 'text-slate-600'}>
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Student ID</span>
                <span className="text-slate-900">{user.studentId || "Not Assigned"}</span>
              </div>
            </div>

            <button 
              onClick={() => handleEditClick(user)}
              className="w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all text-xs"
            >
              Manage Permissions & ID
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingUser(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden p-10">
              <h2 className="text-2xl font-bold mb-6 font-outfit">Manage User: {editingUser.name}</h2>
              <form action={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Student ID</label>
                  <input name="studentId" defaultValue={editingUser.studentId || ""} placeholder="e.g. MIST-2026-001" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Change Role</label>
                  <select 
                    name="role" 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold appearance-none"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Permissions</label>
                    <AnimatePresence>
                      {selectedRole === "STUDENT" && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[10px] font-bold text-red-500 uppercase tracking-tight"
                        >
                          ⚠️ Change role to ADMIN to grant access
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${selectedRole === "STUDENT" ? "opacity-40 pointer-events-none" : ""}`}>
                    {allPermissions.map(p => (
                      <label key={p} className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 rounded-xl border border-transparent hover:border-primary transition-all">
                        <input 
                          type="checkbox" 
                          name="permissions" 
                          value={p} 
                          disabled={selectedRole === "STUDENT"}
                          defaultChecked={selectedRole !== "STUDENT" && editingUser.permissions?.includes(p)} 
                          className="w-4 h-4 text-primary rounded" 
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                  <button disabled={isPending} className="flex-1 py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2">
                    {isPending ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
