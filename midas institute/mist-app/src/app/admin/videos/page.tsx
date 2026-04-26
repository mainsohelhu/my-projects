import { prisma } from "@/lib/prisma";
import VideoManager from "@/components/admin/VideoManager";
import { Video } from "lucide-react";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Video size={28} />
            </div>
            Video Gallery
          </h1>
          <p className="text-slate-400 font-medium mt-2">Manage student testimonials and campus tour videos.</p>
        </div>
      </div>

      <VideoManager initialVideos={videos} />
    </div>
  );
}
