"use client";
import { useActionState } from "react";
import { unlockGallery } from "./actions";

export function GalleryLogin() {
  const [state, action, pending] = useActionState(unlockGallery, {});
  return <form action={action} className="mx-auto mt-8 max-w-md space-y-4 rounded-2xl bg-white p-6">
    <h1 className="text-2xl font-bold">Elgin’s class map</h1>
    <p>Enter the bubble activity password to view everyone’s submissions.</p>
    <label className="block">Admin password<input type="password" name="password" required maxLength={256} autoComplete="current-password" className="mt-2 block w-full rounded-lg border border-[#c7d2c8] p-3" /></label>
    {state.error && <p role="alert" className="text-red-700">{state.error}</p>}
    <button disabled={pending} className="rounded-lg bg-[#243b36] px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? "Opening…" : "Open class map"}</button>
  </form>;
}
