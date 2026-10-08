import "server-only";
import { cookies } from "next/headers";
import { validAdminSession } from "./application-admin";

export const BUBBLE_ADMIN_COOKIE = "gm-bubble-admin";
// This activity has its own login password; other admin areas keep their password.
export function bubblePassword() {
  return process.env.BUBBLE_ADMIN_PASSWORD ?? "elgin";
}
export async function isBubbleAdmin() {
  const secret = process.env.APPLICATION_ADMIN_PASSWORD;
  const token = (await cookies()).get(BUBBLE_ADMIN_COOKIE)?.value;
  if (!secret || !token || !validAdminSession(token, `bubble:${secret}`)) return false;
  return true;
}
