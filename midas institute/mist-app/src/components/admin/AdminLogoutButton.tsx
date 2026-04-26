"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions";

export default function AdminLogoutButton() {
  return (
    <button 
      onClick={async () => {
        await logoutUser();
        window.location.href = "/login";
      }}
      className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-bold border border-slate-100"
    >
      <LogOut size={18} />
      Secure Logout
    </button>
  );
}
