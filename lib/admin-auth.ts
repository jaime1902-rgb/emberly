import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "organ_admin";

const sign = (secret: string) =>
  createHmac("sha256", secret).update("organ-admin-session").digest("hex");

export function passwordMatches(input: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || !input) return false;
  const a = Buffer.from(sign(input));
  const b = Buffer.from(sign(secret));
  return timingSafeEqual(a, b);
}

export function sessionToken() {
  return sign(process.env.ADMIN_PASSWORD ?? "");
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
