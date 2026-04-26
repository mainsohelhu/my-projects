import { prisma } from "@/lib/prisma";
import BlogManager from "@/components/admin/BlogManager";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminBlogsPage() {
  const session = await getSession();
  
  if (!session || (session.user.role !== "SUPER_ADMIN" && !session.user.permissions?.includes("courses"))) {
    redirect("/admin");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-outfit text-slate-900 mb-2">Blog Management</h1>
        <p className="text-slate-500 font-medium">Create, edit, and publish articles for the MIST community.</p>
      </div>

      <BlogManager initialPosts={posts} />
    </div>
  );
}
