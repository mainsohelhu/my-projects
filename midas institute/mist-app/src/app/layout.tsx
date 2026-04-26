import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteThemeProvider, SiteTheme } from "@/components/providers/SiteThemeProvider";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIST | Raipur's Premier IT Training Institute",
  description: "Raipur's #1 IT Training Institute. Certified Trainers, 100% Placement Assistance, and Industry-Ready Skills.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch Global Theme from DB (Source of Truth for Everyone)
  const [themeSetting, configSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "site-theme" } }),
    prisma.siteSetting.findUnique({ where: { key: "custom-theme-config" } }),
  ]);
  
  // 2. Fallback to cookie if DB fails, then default
  const cookieStore = await cookies();
  const dbTheme = themeSetting?.value as SiteTheme;
  const dbConfig = configSetting?.value ? JSON.parse(configSetting.value) : null;
  const cookieTheme = cookieStore.get("site-theme")?.value as SiteTheme;
  
  const siteTheme = (dbTheme || cookieTheme || "default") as SiteTheme;
  const htmlClass = siteTheme === "purple-dark" ? "theme-purple-dark" : siteTheme === "red-white" ? "theme-red-white" : siteTheme === "custom" ? "theme-custom" : "";

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} min-h-screen flex flex-col font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          enableColorScheme={false}
          disableTransitionOnChange
        >
          <SiteThemeProvider initialTheme={siteTheme} initialCustomConfig={dbConfig}>
            <NavbarWrapper />
            <main className="flex-1">
              {children}
            </main>
            <FooterWrapper />
          </SiteThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
