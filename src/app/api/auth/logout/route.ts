import { NextResponse } from "next/server";

function clearSessionCookie() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function POST() {
  return clearSessionCookie();
}

export async function GET() {
  return clearSessionCookie();
}