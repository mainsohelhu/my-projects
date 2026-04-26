import { prisma } from "@/lib/prisma";
import { IndianRupee, Printer, Wallet, Landmark } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  const transactions = await prisma.transaction.findMany({
    include: { 
      enrollment: { 
        include: { 
          student: true,
          course: true 
        } 
      } 
    },
    orderBy: { date: "desc" },
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">Accounts & Billing</h1>
          <p className="text-slate-500 font-medium italic">Audit transaction history and monitor institutional revenue streams.</p>
        </div>
        <div className="glass-morphism px-8 py-4 rounded-[32px] border border-slate-100 bg-white shadow-xl">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Collection</p>
           <p className="text-3xl font-black text-slate-900 font-outfit">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white shadow-sm">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl font-bold font-outfit text-slate-900">Payment Audit Log</h3>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{transactions.length} Transactions Found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Receipt #</th>
                <th className="px-8 py-6">Student & Program</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black font-mono text-slate-400">{t.receiptNumber}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900">{t.enrollment.student.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.enrollment.course.title}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                         {t.method === "UPI" ? <Wallet size={14} /> : t.method === "Cash" ? <IndianRupee size={14} /> : <Landmark size={14} />}
                       </div>
                       <span className="text-xs font-bold text-slate-700">{t.method}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-900">₹{t.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">{new Date(t.date).toLocaleDateString()}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/billing/receipt/${t.receiptNumber}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-all"
                    >
                      <Printer size={14} /> Print
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
