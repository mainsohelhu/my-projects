import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSiteTheme } from "@/components/providers/SiteThemeProvider";

export default function Footer() {
  const { theme } = useSiteTheme();
  const logoSrc = theme === "purple-dark" ? "/logo-purple.png" : theme === "red-white" ? "/logo-red.png" : "/logo.jpeg";

  return (
    <footer className="bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-1 border border-slate-200">
                <Image src={logoSrc} alt="MIDAS" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-outfit text-xl font-bold tracking-tight text-slate-900">
                  <span className="text-primary">M</span>IDAS
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Institute</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Midas Institute of Software Technology. Empowering professionals with world-class Computer Education and 100% placement support.
            </p>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <Link 
                href="https://www.instagram.com/midasinstituteraipur?igsh=dTQ5c3JucnR1dHhm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all"
                aria-label="Follow us on Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </Link>
              {/* WhatsApp */}
              <Link 
                href="https://wa.me/916266846474" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all"
                aria-label="Chat on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-slate-900 font-bold mb-6 font-outfit uppercase tracking-widest text-sm">Quick Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">About Midas</Link></li>
              <li><Link href="/courses" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Explore Courses</Link></li>
              <li><Link href="/placements" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Placement Stories</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Insights & Blog</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Join Us</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="md:col-span-1">
            <h4 className="text-slate-900 font-bold mb-6 font-outfit uppercase tracking-widest text-sm">Our Programs</h4>
            <ul className="space-y-4">
              <li><Link href="/courses" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Full Stack Web Dev</Link></li>
              <li><Link href="/courses" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Data Science & AI</Link></li>

            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-slate-900 font-bold mb-6 font-outfit uppercase tracking-widest text-sm">Get in Touch</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary shrink-0 mt-1" />
                  <span className="text-slate-500 text-sm font-medium leading-relaxed">
                    19/20, Mishra Pada, Tatyapara Chowk,<br />
                    Raipur, Chhattisgarh 492001
                  </span>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="text-primary shrink-0 mt-1" />
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm font-medium">+91 62668 46474</span>
                <span className="text-slate-500 text-sm font-medium">+91 70008 82359</span>
              </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={18} className="text-primary shrink-0 mt-1" />
                <span className="text-slate-500 text-sm font-medium">mistraipur170@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-slate-400 font-black">
          <p>© 2026 MIDAS INSTITUTE OF SOFTWARE TECHNOLOGY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
