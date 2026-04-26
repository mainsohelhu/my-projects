"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function NavbarClient({ user }: { user?: any }) {
  const pathname = usePathname();

  // This check runs instantly on every client-side navigation
  if (pathname.startsWith("/admin")) return null;
  
  // We also hide standard navbar on auth pages for a cleaner look
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") return null;

  return <Navbar user={user} />;
}
