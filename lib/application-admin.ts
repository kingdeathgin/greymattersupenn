import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "gm-application-admin";
export const SESSION_SECONDS = 8 * 60 * 60;

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function passwordsMatch(value: string, expected: string) {
  // Equal length digests allow a constant-time comparison for all inputs.
  return timingSafeEqual(Buffer.from(signature(value, "password-comparison")), Buffer.from(signature(expected, "password-comparison")));
}

export function createAdminSession(secret: string, now = Date.now()) {
  const payload = `elgin@sas.upenn.edu:${now + SESSION_SECONDS * 1000}`;
  return `${payload}:${signature(payload, secret)}`;
}

export function validAdminSession(token: string, secret: string, now = Date.now()) {
  const [email, expires, mac, ...extra] = token.split(":");
  if (extra.length || email !== "elgin@sas.upenn.edu" || !/^\d+$/.test(expires ?? "") || Number(expires) <= now || Number(expires) > now + SESSION_SECONDS * 1000 || !/^[a-f0-9]{64}$/.test(mac ?? "")) return false;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(`${email}:${expires}`, secret), "hex"));
}

export async function isApplicationAdmin() {
  const secret = process.env.APPLICATION_ADMIN_PASSWORD;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(secret && token && validAdminSession(token, secret));
}
