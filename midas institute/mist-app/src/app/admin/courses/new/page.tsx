import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddCourseForm from "@/components/admin/AddCourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <Link href="/admin/courses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-all font-bold text-sm uppercase tracking-widest">
        <ArrowLeft size={18} />
        Back to Course Manager
      </Link>

      <AddCourseForm />
    </div>
  );
}
