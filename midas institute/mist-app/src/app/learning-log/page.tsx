import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LearningLogForm from "@/components/student/LearningLogForm";
import { BookOpen, Calendar, Clock, Pen } from "lucide-react";

export default async function LearningLogPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, role: true, studentId: true },
  });

  if (!user) redirect("/login");

  // Get today's log if already submitted
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLog = await prisma.learningLog.findFirst({
    where: { userId: user.id, createdAt: { gte: today } },
    orderBy: { createdAt: "desc" },
  });

  // Get recent logs (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentLogs = await prisma.learningLog.findMany({
    where: { userId: user.id, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary mb-6">
            <Pen size={12} /> Learning Journal
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 mb-3">
            Daily Learning Log
          </h1>
          <p className="text-slate-500 font-medium">
            Track your progress, reflect on what you learned, and sign off your day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Form or Already Submitted */}
          <div>
            {todayLog ? (
              <div className="bg-white rounded-[40px] border border-green-100 shadow-xl overflow-hidden">
                <div className="bg-green-600 px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl font-outfit">Today's Log Submitted ✓</h2>
                      <p className="text-green-200 text-xs font-medium mt-1">Great work! Come back tomorrow.</p>
                    </div>
                  </div>
                </div>
                <div className="p-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">What you recorded today</p>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed bg-slate-50 rounded-2xl p-6 whitespace-pre-wrap">{todayLog.content}</p>
                  {todayLog.signature && (
                    <div className="mt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Your Signature</p>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <img src={todayLog.signature} alt="Signature" className="h-16 object-contain" />
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-medium mt-4">
                    Submitted at {new Date(todayLog.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ) : (
              <LearningLogForm user={user} />
            )}
          </div>

          {/* Right: Recent History */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50">
                <h3 className="text-lg font-bold font-outfit text-slate-900">Recent Activity</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Last 7 days of your learning journey</p>
              </div>
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto no-scrollbar">
                {recentLogs.length > 0 ? recentLogs.map((log) => (
                  <div key={log.id} className="px-10 py-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">
                            {new Date(log.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      {log.signature && (
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                          ✓ Signed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">{log.content}</p>
                  </div>
                )) : (
                  <div className="px-10 py-12 text-center">
                    <Calendar size={40} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium text-sm">No entries yet this week.</p>
                    <p className="text-slate-300 text-xs mt-1">Start logging today!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
