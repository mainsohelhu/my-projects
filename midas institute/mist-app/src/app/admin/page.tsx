import { Users, GraduationCap, Award, Briefcase, Plus, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EnquiryManager from "@/components/admin/EnquiryManager";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let enquiryCount = 0;
  let studentCount = 0;
  let placementCount = 0;
  let employeeCount = 0;
  let enquiries: any[] = [];

  try {
    enquiryCount = await prisma.enquiry.count();
    studentCount = await prisma.student.count();
    placementCount = await prisma.placement.count();
    employeeCount = await prisma.employee.count();
    enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
  }

  const stats = [
    { title: "Total Leads", value: enquiryCount, icon: <Users />, color: "bg-blue-500", trend: "+12%" },
    { title: "Enrolled Students", value: studentCount, icon: <GraduationCap />, color: "bg-green-500", trend: "+5%" },
    { title: "Placements", value: placementCount, icon: <Award />, color: "bg-purple-500", trend: "+24%" },
    { title: "Total Staff", value: employeeCount, icon: <Briefcase />, color: "bg-orange-500", trend: "+2%" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">ERP Dashboard</h1>
          <p className="text-slate-500 font-medium italic">Holistic overview of Midas Institute's operations.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/courses/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <Plus size={20} />
            New Program
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism p-8 rounded-[40px] relative overflow-hidden group bg-white border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{stat.title}</p>
              <div className="flex items-center justify-between">
                <h3 className="text-4xl font-bold text-slate-900">{stat.value}</h3>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-primary">
                 <ArrowUpRight size={14} />
                 {stat.trend} INCREASE
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRM Section */}
      <div className="glass-morphism rounded-[40px] overflow-hidden border border-slate-100 bg-white">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl font-bold font-outfit text-slate-900 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            CRM: Admission Leads
          </h3>
          <Link href="/admin/students" className="text-xs text-primary font-black uppercase tracking-widest hover:underline">View All Students</Link>
        </div>
        <EnquiryManager initialEnquiries={enquiries} />
      </div>
    </div>
  );
}
