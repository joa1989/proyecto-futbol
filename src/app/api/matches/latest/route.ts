import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
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
      return NextResponse.json({ error: "El usuario no tiene club" }, { status: 400 });
    }

    const match = await prisma.match.findFirst({
      where: { homeClubId: user.club.id },
      orderBy: { kickoffAt: "desc" },
    });

    return NextResponse.json({ success: true, match });
  } catch (e) {
    console.error("latest match error:", e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}