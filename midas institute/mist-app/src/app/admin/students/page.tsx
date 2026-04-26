import { prisma } from "@/lib/prisma";
import StudentManager from "@/components/admin/StudentManager";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const students = await prisma.student.findMany({
    include: { 
      enrollments: {
        include: { course: true }
      } 
    },
    orderBy: { createdAt: "desc" },
  });

  const courses = await prisma.course.findMany();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">Academic Records</h1>
        <p className="text-slate-500 font-medium italic">Manage professional student profiles and multi-program enrollments.</p>
      </div>

      <StudentManager initialStudents={students} courses={courses} />
    </div>
  );
}
