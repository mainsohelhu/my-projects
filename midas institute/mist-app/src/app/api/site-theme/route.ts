import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const THEME_KEY = "site-theme";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: THEME_KEY },
    });
    const theme = setting?.value ?? "default";
    return NextResponse.json({ theme });
  } catch {
    return NextResponse.json({ theme: "default" });
  }
}

export async function POST(req: Request) {
  try {
    const { theme, customConfig } = await req.json();
    const validThemes = ["default", "purple-dark", "red-white", "custom"];
    if (!validThemes.includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    // Update main theme
    await prisma.siteSetting.upsert({
      where: { key: "site-theme" },
      update: { value: theme },
      create: { key: "site-theme", value: theme },
    });

    // Update custom config if provided
    if (theme === "custom" && customConfig) {
      await prisma.siteSetting.upsert({
        where: { key: "custom-theme-config" },
        update: { value: JSON.stringify(customConfig) },
        create: { key: "custom-theme-config", value: JSON.stringify(customConfig) },
      });
    }

    // Set cookie for instant server-side detection
    const response = NextResponse.json({ success: true, theme });
    response.cookies.set("site-theme", theme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Theme save error:", err);
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}
