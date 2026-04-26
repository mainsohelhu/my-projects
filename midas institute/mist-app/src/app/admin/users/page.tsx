import { prisma } from "@/lib/prisma";
import UserManager from "@/components/admin/UserManager";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getSession();
  
  // Only Super Admin can access this page
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2">User Access Management</h1>
        <p className="text-slate-500 font-medium">Assign Student IDs, manage Admin permissions, and control account roles.</p>
      </div>

      <UserManager initialUsers={users} />
    </div>
  );
}
