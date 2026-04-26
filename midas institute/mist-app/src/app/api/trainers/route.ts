import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trainers = await prisma.trainer.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(trainers);
}
