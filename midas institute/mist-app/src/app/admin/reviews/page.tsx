import { prisma } from "@/lib/prisma";
import ReviewManager from "@/components/admin/ReviewManager";
import { Users } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Users size={28} />
            </div>
            Student Reviews
          </h1>
          <p className="text-slate-400 font-medium mt-2">Manage course testimonials and student success stories.</p>
        </div>
      </div>

      <ReviewManager initialReviews={reviews} />
    </div>
  );
}
