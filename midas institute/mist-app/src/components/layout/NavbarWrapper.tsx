import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavbarClient from "./NavbarClient";

export default async function NavbarWrapper() {
  const session = await getSession();
  let latestUser = session?.user;
  
  // Always get fresh data from DB for the Navbar (Student ID, Role, etc.)
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, studentId: true }
    });
    if (dbUser) latestUser = dbUser;
  }
  
  return <NavbarClient user={latestUser} />;
}
