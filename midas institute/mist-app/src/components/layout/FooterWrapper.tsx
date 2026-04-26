"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide Footer on admin routes
  if (pathname?.startsWith("/admin")) return null;
  
  return <Footer />;
}
