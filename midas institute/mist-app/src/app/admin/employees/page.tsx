import { prisma } from "@/lib/prisma";
import EmployeeManager from "@/components/admin/EmployeeManager";

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">Staff Directory</h1>
        <p className="text-slate-500 font-medium italic">Manage employees, assign custom roles, and filter by department.</p>
      </div>

      <EmployeeManager initialEmployees={employees} />
    </div>
  );
}
