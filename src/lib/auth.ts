import jwt from "jsonwebtoken";

export type SessionPayload = {
  userId: string;
};

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("Missing JWT_SECRET");
}

const JWT_SECRET: string = secret;

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}