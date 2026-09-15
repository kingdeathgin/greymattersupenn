import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/nav/Navigation";
import { isApplicationAdmin } from "@/lib/application-admin";
import { listAcknowledgements } from "@/lib/application-store";
import { members, declinedMembers } from "@/lib/application-roster";
import { AdminLogin } from "./AdminLogin";
import { signOutAdmin } from "./actions";

export const metadata: Metadata = { title: "Application confirmations | Penn Grey Matters", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ApplicationAdminPage() {
  const authorized = await isApplicationAdmin();
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)] px-4 md:px-8 text-[var(--color-text-primary)]">
        <section className="max-w-6xl mx-auto py-16">
          <h1 className="font-display text-4xl">Application confirmations</h1>
          {authorized ? <ConfirmationList /> : <AdminLogin />}
        </section>
      </main>
    </>
  );
}

async function ConfirmationList() {
  let confirmations;
  try { confirmations = await listAcknowledgements(); }
  catch { return <p role="alert" className="mt-6">Couldn’t load confirmations. <Link href="/application-update/admin" className="underline">Try again</Link>.</p>; }
  const confirmed = new Map(confirmations.map((row) => [row.email, row.confirmed_at]));
  const roster = [
    ...members.map(([email, name, role]) => ({ email, name, role })),
    ...Object.entries(declinedMembers).map(([email, name]) => ({ email, name, role: "—" })),
  ].sort((a, b) => Number(confirmed.has(b.email)) - Number(confirmed.has(a.email)) || a.name.localeCompare(b.name));
  const total = roster.filter((person) => confirmed.has(person.email)).length;
  return (
    <>
      <p className="mt-5 text-[var(--color-text-muted)]">{total} of {roster.length} people confirmed they read their message. {roster.length - total} have not confirmed.</p>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">A confirmation is recorded when someone checks the box, not when they open the page. Times are shown in Philadelphia time.</p>
      <div className="flex gap-6 my-6">
        <Link href="/application-update/admin" className="underline text-[var(--color-accent)]">Refresh</Link>
        <form action={signOutAdmin}><button className="underline">Sign out</button></form>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Applicants and their message acknowledgement status</caption>
          <thead><tr>{["Name", "Email", "Role", "Confirmation"].map((label) => <th key={label} scope="col" className="p-4 border-b border-[var(--color-accent)]/30">{label}</th>)}</tr></thead>
          <tbody>{roster.map((person) => {
            const date = confirmed.get(person.email);
            return <tr key={person.email} className="border-b border-white/10">
              <th scope="row" className="p-4 font-normal">{person.name}</th>
              <td className="p-4">{person.email}</td>
              <td className="p-4">{person.role}</td>
              <td className="p-4">{date ? <span className="text-[var(--color-accent)]">Confirmed · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }).format(new Date(date))}</span> : <span className="text-[var(--color-text-muted)]">Not confirmed</span>}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </>
  );
}
