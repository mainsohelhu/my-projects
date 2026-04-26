import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookOpen, Calendar, Search, User, CheckCircle2, Clock } from "lucide-react";

export default async function AdminLearningLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string; month?: string }>;
}) {
  const { userId, month } = await searchParams;
  const session = await getSession();

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  // Get all students for the filter
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, studentId: true },
    orderBy: { name: "asc" },
  });

  // Build date filter
  let dateFilter: any = {};
  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    dateFilter = { createdAt: { gte: start, lte: end } };
  }

  // Fetch logs - NO limit, full lifetime history
  const logs = await prisma.learningLog.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...dateFilter,
    },
    include: {
      user: { select: { id: true, name: true, studentId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by user → then by date for summary
  const totalToday = logs.filter((l) => {
    const d = new Date(l.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2">Learning Logs</h1>
        <p className="text-slate-500 font-medium">Complete lifetime history of every student's daily learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Lifetime Entries", value: logs.length, icon: BookOpen, color: "bg-blue-50 text-blue-600" },
          { label: "Students Active", value: new Set(logs.map((l) => l.userId)).size, icon: User, color: "bg-green-50 text-green-600" },
          { label: "Submitted Today", value: totalToday, icon: Calendar, color: "bg-primary/10 text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.color}`}>
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 font-outfit">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end mb-10">
        <div className="space-y-2 flex-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by Student</label>
          <select name="userId" defaultValue={userId || ""} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold appearance-none text-sm">
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.studentId ? `(${s.studentId})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 flex-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by Month</label>
          <input
            name="month"
            type="month"
            defaultValue={month || ""}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
        >
          <Search size={18} /> Apply Filter
        </button>
      </form>

      {/* Logs Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-outfit text-slate-900">Lifetime Learning Entries</h3>
            {logs.length > 0 && (
              <p className="text-xs text-slate-400 font-medium mt-1">
                From {new Date(logs[logs.length - 1].createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} to now
              </p>
            )}
          </div>
          <span className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500">{logs.length} Records</span>
        </div>

        {logs.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {logs.map((log) => (
              <div key={log.id} className="px-10 py-8 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Student Info */}
                  <div className="lg:w-56 shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                        {log.user.name.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{log.user.name}</p>
                        {log.user.studentId && (
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{log.user.studentId}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 ml-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={10} />
                        {new Date(log.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <Clock size={10} />
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-2xl p-6">
                      {log.content}
                    </p>
                  </div>

                  {/* Signature */}
                  {log.signature && (
                    <div className="lg:w-48 shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 size={10} className="text-green-500" /> Signed
                      </p>
                      <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
                        <img src={log.signature} alt="Signature" className="h-14 w-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <BookOpen size={56} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No learning logs found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
