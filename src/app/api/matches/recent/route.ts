import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !user.club) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const matches = await prisma.match.findMany({
    where: {
    status: "PLAYED",
    OR: [{ homeClubId: user.club.id }, { awayClubId: user.club.id }],
    },
    orderBy: {
      playedAt: "desc",
    },
    take: 10,
  });

  return NextResponse.json(matches);
}