import { prisma } from "@/lib/prisma";
import PlacementManager from "@/components/admin/PlacementManager";

export const dynamic = "force-dynamic";

export default async function AdminPlacementsPage() {
  const placements = await prisma.placement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold font-outfit mb-2 text-slate-900 text-left">Success Hall of Fame</h1>
        <p className="text-slate-500 font-medium italic">Manage hiring records, track alumni success, and update placement metrics.</p>
      </div>

      <PlacementManager initialPlacements={placements} />
    </div>
  );
}
