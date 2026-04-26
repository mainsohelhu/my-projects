import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let session = null;

  try {
    session = await getSession();
  } catch (error) {
    console.error("Middleware: Session check failed", error);
  }

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Pass pathname to components via headers (for NavbarWrapper)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
