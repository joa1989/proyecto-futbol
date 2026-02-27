import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

function randomInt(min: number, max: number) {
  // inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BOT_CLUBS = [
  "Atlético Bot",
  "Deportivo Script",
  "FC Turbopack",
  "Prisma United",
  "Railway Rangers",
  "Next Town",
  "TypeScript City",
];

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

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!user.club) {
      return NextResponse.json({ error: "El usuario no tiene club" }, { status: 400 });
    }

    // Dummy match result (simple random for Sprint 0)
    const opponent = BOT_CLUBS[randomInt(0, BOT_CLUBS.length - 1)];
    const homeGoals = randomInt(0, 4);
    const awayGoals = randomInt(0, 4);

    const match = {
      type: "FRIENDLY",
      playedAt: new Date().toISOString(),
      home: { name: user.club.name, goals: homeGoals },
      away: { name: opponent, goals: awayGoals },
    };

    return NextResponse.json({ success: true, match });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}