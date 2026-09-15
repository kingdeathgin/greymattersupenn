"use server";

import { redirect } from "next/navigation";
import { members, declinedMembers } from "@/lib/application-roster";
import { saveAcknowledgement } from "@/lib/application-store";

export type ApplicationUpdate = {
  email?: string;
  declinedName?: string;
  member?: { name: string; role: string; returning: boolean };
  error?: string;
};

export async function checkApplication(
  _previous: ApplicationUpdate,
  formData: FormData,
): Promise<ApplicationUpdate> {
  const value = formData.get("email");
  if (typeof value !== "string" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return { error: "Please enter a valid email address." };
  }
  if (value.trim().toLowerCase() === "elgin@sas.upenn.edu") redirect("/application-update/admin");
  const match = members.find(([email]) => email === value.trim().toLowerCase());
  if (!match) {
    const declinedName = declinedMembers[value.trim().toLowerCase()];
    if (declinedName) return { declinedName, email: value.trim().toLowerCase() };
    return { error: "We couldn’t find an update for that email. Check the address you used to apply, or contact us for help. This does not mean your application was declined." };
  }
  const [, name, role, returning] = match;
  return { member: { name, role, returning }, email: match[0] };
}

export type AcknowledgementState = { success?: boolean; error?: string };

export async function acknowledgeApplication(
  email: string,
  _previous: AcknowledgementState,
  formData: FormData,
): Promise<AcknowledgementState> {
  if (formData.get("acknowledged") !== "yes") {
    return { error: "Please check the box to confirm you’ve read your message." };
  }
  const lookup = new FormData();
  if (typeof email !== "string") return { error: "Please look up your application again." };
  if (email.trim().toLowerCase() === "elgin@sas.upenn.edu") return { error: "Please look up your application again." };
  lookup.set("email", email);
  const update = await checkApplication({}, lookup);
  if (!update.email || (!update.member && !update.declinedName)) {
    return { error: "Please look up your application again." };
  }
  try {
    await saveAcknowledgement(update.email);
    return { success: true };
  } catch {
    return { error: "We couldn’t save your confirmation. Please try again." };
  }
}
