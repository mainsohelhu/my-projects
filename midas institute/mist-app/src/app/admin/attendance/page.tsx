import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AttendanceClient from "@/components/attendance/AttendanceClient";
import { User, MapPin, Clock, ArrowRight } from "lucide-react";

export default async function AdminAttendancePage() {
  const session = await getSession();
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/admin");
  }

  // Get current user's last record for today
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const lastRecord = await prisma.attendance.findFirst({
    where: {
      userId: session.user.id,
      timestamp: { gte: today }
    },
    orderBy: { timestamp: 'desc' }
  });

  // If Super Admin, get all records for today
  let allRecords: any[] = [];
  if (session.user.role === "SUPER_ADMIN") {
    allRecords = await prisma.attendance.findMany({
      where: { timestamp: { gte: today } },
      include: { user: true },
      orderBy: { timestamp: 'desc' }
    });
  }

  return (
    <div className="p-8 md:p-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2">Staff Attendance</h1>
          <p className="text-slate-500 font-medium">Log your daily office hours with live location verification.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* Personal Punching Card */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 ml-2">Personal Punch</h2>
          <AttendanceClient user={session.user} lastRecord={lastRecord} />
        </section>

        {/* Super Admin: All Staff Log */}
        {session.user.role === "SUPER_ADMIN" && (
          <section className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-outfit text-slate-900">Live Office Log</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Today's staff activity</p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                {allRecords.length} Entries
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Member</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                            {record.user.name.substring(0,1)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{record.user.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{record.user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${record.type === 'IN' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {record.type === 'IN' ? 'Login' : 'Logout'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                          <Clock size={14} />
                          {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <MapPin size={14} />
                          {record.lat?.toFixed(4)}, {record.lng?.toFixed(4)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {allRecords.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-12 text-center text-slate-400 font-medium italic">
                        No activity recorded yet for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
