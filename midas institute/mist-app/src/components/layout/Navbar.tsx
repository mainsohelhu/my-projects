"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryFormModal from "@/components/forms/EnquiryFormModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Courses", href: "/courses" },
  { name: "Blog", href: "/blog" },
  { name: "Placements", href: "/placements" },
];

import { logoutUser } from "@/app/actions";

import { useSiteTheme } from "@/components/providers/SiteThemeProvider";

export default function Navbar({ user }: { user?: any }) {
  const { theme } = useSiteTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoSrc = theme === "purple-dark" ? "/logo-purple.png" : theme === "red-white" ? "/logo-red.png" : "/logo.jpeg";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser();
    window.location.reload();
  };


  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  if (!mounted) return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-transparent py-6">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="w-10 h-10 bg-slate-100 rounded-lg animate-pulse" />
        <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
      </div>
    </header>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-1 border border-slate-100 shadow-sm">
                  <Image 
                    src={logoSrc} 
                    alt="MIDAS" 
                    fill 
                    sizes="40px"
                    className="object-contain p-1"
                  />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-outfit text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  <span className="text-primary">M</span>IDAS
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Institute</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-bold tracking-wide text-slate-500 hover:text-slate-900 transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Auth / CTA */}
            <div className="flex items-center gap-4 md:gap-6">
              {user ? (
                <div className="hidden md:flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <UserIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 leading-none">{user.name}</span>
                      {user.studentId && <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.studentId}</span>}
                    </div>
                  </div>
                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                    <Link href="/admin" className="p-2 text-slate-400 hover:text-primary transition-colors" title="Admin Dashboard">
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  {user.role === 'STUDENT' && (
                    <Link href="/learning-log" className="p-2 text-slate-400 hover:text-primary transition-colors" title="Learning Log">
                      <BookOpen size={20} />
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Log In</Link>
                  <button
                    onClick={() => setEnquiryModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2 text-sm font-bold text-white transition-all hover:bg-primary hover:text-black hover:scale-105 active:scale-95 border border-black/5"
                  >
                    Enquire Now
                  </button>
                </div>
              )}
              <button
                className="md:hidden p-2 text-slate-900 relative z-[70] transition-transform active:scale-90"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-[400px] z-[60] bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Sticky Header: Logo + X Close */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-white p-1 border border-slate-100 shadow-sm">
                    <Image src={logoSrc} alt="MIDAS" fill sizes="36px" className="object-contain p-1" />
                  </div>
                  <span className="font-outfit text-xl font-bold text-slate-900 leading-none">
                    <span className="text-primary">M</span>IDAS
                    <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-black">Institute</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                  aria-label="Close Menu"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable Content — isolated from page scroll */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-8 py-6 flex flex-col">
                {/* Enquire Now — prominent at top */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setEnquiryModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-black font-black rounded-2xl text-base mb-6 hover:bg-black hover:text-white transition-all shadow-lg shadow-primary/30 active:scale-95"
                >
                  ✏️ Enquire Now
                  <ArrowRight size={18} />
                </motion.button>

                <nav className="flex flex-col gap-1 mb-8">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-3xl font-outfit font-bold text-slate-900 py-4 flex items-center justify-between group active:text-primary transition-all border-b border-slate-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                        <ArrowRight className="opacity-0 group-active:opacity-100 -translate-x-4 group-active:translate-x-0 transition-all text-primary" size={24} />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Auth Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {user ? (
                    <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black font-black text-xl">
                          {user.name.substring(0, 1)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                          {user.studentId && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.studentId}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                          <Link 
                            href="/admin" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 active:bg-slate-100"
                          >
                            <LayoutDashboard size={14} />
                            Dashboard
                          </Link>
                        )}
                        {user.role === 'STUDENT' && (
                          <Link 
                            href="/learning-log" 
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary active:bg-primary/20"
                          >
                            <BookOpen size={14} />
                            Learning Log
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 py-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 active:bg-red-100"
                        >
                          <LogOut size={14} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-4 border-2 border-slate-900 text-slate-900 font-black rounded-2xl text-base hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                    >
                      <UserIcon size={18} />
                      Log In to Student Account
                    </Link>
                  )}

                  <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Quick Contact</p>
                    <p className="text-slate-900 font-black text-xl mb-1">+91 62668 46474</p>
                    <p className="text-slate-900 font-black text-xl mb-1">+91 70008 82359</p>
                    <p className="text-slate-500 text-sm font-medium">mistraipur170@gmail.com</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EnquiryFormModal 
        isOpen={enquiryModalOpen} 
        onClose={() => setEnquiryModalOpen(false)} 
      />
    </>
  );
}
