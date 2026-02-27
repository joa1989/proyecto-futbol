import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

const BOT_CLUBS = [
  "Atlético Bot",
  "Deportivo Script",
  "FC Turbopack",
  "Prisma United",
  "Railway Rangers",
  "Next Town",
  "TypeScript City",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { club: true },
    });

    if (!user?.club) {
      return NextResponse.json(
        { error: "El usuario no tiene club" },
        { status: 400 }
      );
    }

    // Para test: kickoff 1 minuto en el futuro
    const kickoffAt = new Date(Date.now() + 60 * 1000);

    const match = await prisma.match.create({
      data: {
        type: "FRIENDLY",
        status: "PENDING",
        kickoffAt,
        homeClubId: user.club.id,
        awayName: BOT_CLUBS[randomInt(0, BOT_CLUBS.length - 1)],
      },
    });

    return NextResponse.json({ success: true, match });
  } catch (e) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}