import { Settings, Palette, Shield, Bell } from "lucide-react";
import ThemeToggleClient from "@/components/admin/ThemeToggleClient";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium italic">
          Configure your institute's website appearance and preferences.
        </p>
      </div>

      {/* Settings sections */}
      <div className="space-y-8">
        {/* Theme Section */}
        <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-900">Appearance</h2>
              <p className="text-xs text-slate-400">Control how your website looks to visitors</p>
            </div>
          </div>
          <div className="p-8">
            <ThemeToggleClient />
          </div>
        </div>

        {/* Coming Soon — Security */}
        <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white opacity-60">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-400">Security</h2>
              <p className="text-xs text-slate-400">Password policies, 2FA, session management</p>
            </div>
            <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        </div>

        {/* Coming Soon — Notifications */}
        <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white opacity-60">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-400">Notifications</h2>
              <p className="text-xs text-slate-400">Email alerts, SMS notifications, and webhooks</p>
            </div>
            <span className="ml-auto text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
