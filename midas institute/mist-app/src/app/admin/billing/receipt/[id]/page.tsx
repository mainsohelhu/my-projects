import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PrintButton from "@/components/admin/PrintButton";
import { cookies } from "next/headers";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch Site Theme for dynamic logo
  const [themeSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "site-theme" } }),
  ]);
  const cookieStore = await cookies();
  const siteTheme = (themeSetting?.value || cookieStore.get("site-theme")?.value || "default") as any;
  const logoSrc = siteTheme === "purple-dark" ? "/logo-purple.png" : siteTheme === "red-white" ? "/logo-red.png" : "/logo.jpeg";

  const transaction = await prisma.transaction.findUnique({
    where: { receiptNumber: id },
    include: { 
      enrollment: { 
        include: { 
          student: true,
          course: true 
        } 
      } 
    },
  });

  if (!transaction) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-10 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-10 print:hidden">
           <Link href="/admin/billing" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
             <ArrowLeft size={20} /> Back to Billing
           </Link>
           <PrintButton />
        </div>

        {/* Receipt */}
        <div className="bg-white p-16 rounded-[40px] shadow-2xl border border-slate-100 print:shadow-none print:border-none print:rounded-none">
           <div className="flex justify-between items-start border-b border-slate-100 pb-12 mb-12">
              <div className="flex items-center gap-4">
                 <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white p-1 border border-slate-100 shadow-sm">
                   <Image src={logoSrc} alt="MIDAS" fill className="object-contain" />
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tighter">MIDAS INSTITUTE</h1>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Software Technology</p>
                 </div>
              </div>
              <div className="text-right">
                 <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">Payment Receipt</div>
                 <p className="text-sm font-black text-slate-900">#{transaction.receiptNumber}</p>
                 <p className="text-xs text-slate-400 font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-20 mb-16">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Issued To</p>
                 <p className="text-xl font-bold text-slate-900 mb-1">{transaction.enrollment.student.name}</p>
                 <p className="text-sm text-slate-500 font-medium mb-1">{transaction.enrollment.student.phone}</p>
                 <p className="text-xs text-slate-400 font-medium italic">{transaction.enrollment.student.address || "N/A"}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Program Detail</p>
                 <p className="text-xl font-bold text-slate-900 mb-1">{transaction.enrollment.course.title}</p>
                 <p className="text-xs text-slate-500 font-medium italic">Duration: {transaction.enrollment.course.duration}</p>
              </div>
           </div>

           <div className="border border-slate-100 rounded-3xl overflow-hidden mb-12">
              <table className="w-full">
                 <thead className="bg-slate-50">
                    <tr className="text-left">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <tr>
                       <td className="px-8 py-8">
                          <p className="font-bold text-slate-900">Installment - {transaction.method}</p>
                          <p className="text-xs text-slate-400 mt-1">{transaction.note || "Course tuition fee payment"}</p>
                       </td>
                       <td className="px-8 py-8 text-right font-black text-2xl text-slate-900">₹{transaction.amount.toLocaleString()}</td>
                    </tr>
                 </tbody>
              </table>
           </div>

           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Terms & Notes</p>
                 <ul className="text-[10px] text-slate-400 space-y-2 max-w-[300px] list-disc ml-4">
                    <li>This is a computer-generated receipt for {transaction.enrollment.student.name}.</li>
                    <li>Guardian Contact: {transaction.enrollment.student.guardianName || "N/A"}.</li>
                    <li>Fees once paid are non-refundable.</li>
                 </ul>
              </div>
              <div className="text-center border-t border-slate-100 pt-8 px-12">
                 <div className="w-32 h-1 bg-slate-100 mb-4 mx-auto" />
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
