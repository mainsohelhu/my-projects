import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, 
  Award, BarChart, Settings, LogOut, ChevronRight,
  ShieldCheck, Briefcase, IndianRupee, UserCheck, Key,
  Newspaper, Clock, BookMarked
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  const user = session.user;

  // Fetch Site Theme for dynamic logo
  const setting = await prisma.siteSetting.findUnique({ where: { key: "site-theme" } });
  const cookieStore = await cookies();
  const dbTheme = setting?.value as any;
  const cookieTheme = cookieStore.get("site-theme")?.value as any;
  const siteTheme = dbTheme || cookieTheme || "default";
  const logoSrc = siteTheme === "purple-dark" ? "/logo-purple.png" : siteTheme === "red-white" ? "/logo-red.png" : "/logo.jpeg";

  const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} />, permission: "all" },
    { name: "Courses", href: "/admin/courses", icon: <BookOpen size={18} />, permission: "courses" },
    { name: "Students", href: "/admin/students", icon: <GraduationCap size={18} />, permission: "students" },
    { name: "Billing", href: "/admin/billing", icon: <IndianRupee size={18} />, permission: "billing" },
    { name: "Employees", href: "/admin/employees", icon: <Briefcase size={18} />, permission: "employees" },
    { name: "Placements", href: "/admin/placements", icon: <Award size={18} />, permission: "placements" },
    { name: "Trainers", href: "/admin/trainers", icon: <UserCheck size={18} />, permission: "trainers" },
    { name: "Videos", href: "/admin/videos", icon: <BarChart size={18} />, permission: "videos" },
    { name: "Reviews", href: "/admin/reviews", icon: <Users size={18} />, permission: "reviews" },
    { name: "Blog Posts", href: "/admin/blogs", icon: <Newspaper size={18} />, permission: "courses" },
    { name: "Attendance", href: "/admin/attendance", icon: <Clock size={18} />, permission: "all" },
    { name: "Learning Logs", href: "/admin/learning-logs", icon: <BookMarked size={18} />, role: "SUPER_ADMIN" },
    { name: "Access Control", href: "/admin/users", icon: <Key size={18} />, role: "SUPER_ADMIN" },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={18} />, permission: "all" },
  ];

  const filteredLinks = sidebarLinks.filter(link => {
    if (user.role === "SUPER_ADMIN") return true;
    if (link.role && user.role !== link.role) return false;
    if (link.permission === "all") return true;
    return user.permissions?.includes(link.permission);
  });

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full hidden md:flex shrink-0 shadow-sm relative z-20">
        <div className="p-8 flex flex-col gap-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-1 border border-slate-100 shadow-sm">
              <Image src={logoSrc} alt="MIDAS" fill sizes="40px" className="object-contain" />
            </div>
            <div>
              <div className="font-outfit text-lg font-bold tracking-tight text-slate-900">
                <span className="text-primary">M</span>IDAS <span className="text-xs text-slate-400 font-black">ADMIN</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{user.role} PANEL</div>
            </div>
          </div>

          <Link 
            href="/" 
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all text-xs font-black uppercase tracking-widest border border-primary/20"
          >
            <BookOpen size={16} />
            Back to Website
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {filteredLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex items-center justify-between group px-5 py-3.5 rounded-2xl hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">{link.icon}</span>
                <span className="text-sm font-bold">{link.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-100">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
             <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
               Authorized Session: <span className="text-green-600">Encrypted AES-256</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{user.role}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-black shadow-sm uppercase">
              {user.name.substring(0, 2)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#fcfcfc] p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
