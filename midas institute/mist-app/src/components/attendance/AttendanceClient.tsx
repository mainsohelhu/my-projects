"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, LogIn, LogOut, CheckCircle2, AlertCircle, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { markAttendance } from "@/app/actions";

export default function AttendanceClient({ user, lastRecord }: { user: any, lastRecord: any }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isInsideOffice, setIsInsideOffice] = useState<boolean | null>(null);

  // Office coordinates (example: Raipur location)
  const OFFICE_LAT = 21.2514;
  const OFFICE_LNG = 81.6296;
  const RADIUS_METERS = 200; // 200 meters allowance

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const handleAction = async (type: 'IN' | 'OUT') => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setStatus('loading');
    setMessage("Verifying location...");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const dist = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
      
      if (dist > RADIUS_METERS) {
        setStatus('error');
        setMessage(`Verification Failed: You are ${Math.round(dist/1000)}km away from the office. Please punch in from the office premise.`);
        return;
      }

      const res = await markAttendance({
        userId: user.id,
        type,
        lat: latitude,
        lng: longitude,
        deviceInfo: navigator.userAgent
      });

      if (res.success) {
        setStatus('success');
        setMessage(`Successfully logged ${type === 'IN' ? 'Login' : 'Logout'} time.`);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setStatus('error');
        setMessage(res.error || "Failed to log time.");
      }
    }, (err) => {
      setStatus('error');
      setMessage("Location access denied. Please allow location to punch in/out.");
    }, { enableHighAccuracy: true });
  };

  const isCheckedIn = lastRecord?.type === "IN";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Time Display */}
      <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Official Office Time</p>
        <h1 className="text-6xl md:text-7xl font-black font-outfit text-slate-900 tracking-tight mb-4">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </h1>
        <p className="text-slate-500 font-bold text-sm">
          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Action Area */}
      <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <UserIcon size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">{user.name}</h3>
              <p className="text-slate-400 text-xs font-medium">{user.role} Account</p>
            </div>
            {isCheckedIn && (
              <div className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20 animate-pulse">
                Active Duty
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              disabled={isCheckedIn || status === 'loading'}
              onClick={() => handleAction('IN')}
              className={`group flex items-center justify-center gap-3 py-6 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all active:scale-95 ${isCheckedIn ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed' : 'bg-primary text-black hover:shadow-xl hover:shadow-primary/20'}`}
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : <LogIn size={20} className="group-hover:-translate-x-1 transition-transform" />}
              Punch In (Login)
            </button>

            <button 
              disabled={!isCheckedIn || status === 'loading'}
              onClick={() => handleAction('OUT')}
              className={`group flex items-center justify-center gap-3 py-6 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all active:scale-95 ${!isCheckedIn ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20'}`}
            >
              {status === 'loading' ? <Loader2 className="animate-spin" /> : <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />}
              Punch Out (Logout)
            </button>
          </div>

          <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-8">
            {isCheckedIn ? "You are currently logged in for the day" : "Waiting for your first punch in"}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-50 text-green-700 rounded-2xl text-center font-bold border border-green-100 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} />
            {message}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-700 rounded-2xl text-center font-bold border border-red-100 flex items-center justify-center gap-2">
            <AlertCircle size={18} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Log */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Recent Activity</h4>
        <div className="space-y-4">
          {lastRecord ? (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lastRecord.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {lastRecord.type === 'IN' ? <LogIn size={18} /> : <LogOut size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{lastRecord.type === 'IN' ? 'Login' : 'Logout'}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{new Date(lastRecord.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-bold text-green-600">Verified</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400 text-sm font-medium py-4">No records found for today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
