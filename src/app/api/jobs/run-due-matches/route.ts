import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.JOBS_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "JOBS_SECRET no configurado" }, { status: 500 });
    }

    const got = req.headers.get("x-jobs-secret");
    if (got !== secret) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const now = new Date();

    // Traer un lote de partidos vencidos (evita ejecutar infinito)
    const due = await prisma.match.findMany({
      where: {
        status: "PENDING",
        kickoffAt: { lte: now },
      },
      orderBy: { kickoffAt: "asc" },
      take: 50,
    });

    let played = 0;

    for (const m of due) {
      // Motor dummy por ahora
      const homeGoals = randomInt(0, 4);
      const awayGoals = randomInt(0, 4);

      await prisma.match.update({
        where: { id: m.id },
        data: {
          status: "PLAYED",
          playedAt: now,
          homeGoals,
          awayGoals,
        },
      });

      played++;
    }

    return NextResponse.json({
      success: true,
      now,
      dueFound: due.length,
      played,
    });
  } catch (e) {
    console.error("run-due-matches error:", e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}