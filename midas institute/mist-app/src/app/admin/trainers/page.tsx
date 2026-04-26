import { prisma } from "@/lib/prisma";
import TrainerManager from "@/components/admin/TrainerManager";
import { UserCheck } from "lucide-react";

export default async function AdminTrainersPage() {
  const trainers = await prisma.trainer.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <UserCheck size={22} />
          </div>
          <h1 className="text-4xl font-outfit font-bold text-slate-900">Faculty Management</h1>
        </div>
        <p className="text-slate-400 text-sm ml-13 font-medium">
          Manage trainer profiles displayed on the public website. All changes reflect immediately.
        </p>
      </div>
      <TrainerManager initialTrainers={trainers} />
    </div>
  );
}
