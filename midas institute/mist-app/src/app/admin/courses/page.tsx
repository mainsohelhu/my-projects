import { prisma } from "@/lib/prisma";
import CourseManager from "@/components/admin/CourseManager";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">Academic Programs</h1>
        <p className="text-slate-500 font-medium italic">Manage curriculum, define durations, and launch new technical bootcamps.</p>
      </div>

      <CourseManager initialCourses={courses} />
    </div>
  );
}
