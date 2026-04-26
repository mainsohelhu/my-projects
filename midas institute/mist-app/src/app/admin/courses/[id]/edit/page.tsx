import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditCourseForm from "@/components/admin/EditCourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) notFound();

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-all font-bold text-sm uppercase tracking-widest">
        <ArrowLeft size={18} />
        Back to Course Manager
      </Link>

      <EditCourseForm course={course} />
    </div>
  );
}
