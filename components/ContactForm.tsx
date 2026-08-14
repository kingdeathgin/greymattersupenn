"use client";

import { useState } from "react";

const ROLES = ["Writer", "Artist", "Editor", "Podcast Host", "Developer"] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          university: formData.get("university"),
          roleInterest: formData.get("roleInterest"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block font-mono text-sm text-[var(--color-text-muted)] mb-[var(--space-sm)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-mono text-sm text-[var(--color-text-muted)] mb-[var(--space-sm)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="university" className="block font-mono text-sm text-[var(--color-text-muted)] mb-[var(--space-sm)]">
          University (optional)
        </label>
        <input
          id="university"
          name="university"
          type="text"
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="roleInterest" className="block font-mono text-sm text-[var(--color-text-muted)] mb-[var(--space-sm)]">
          Role Interest
        </label>
        <select
          id="roleInterest"
          name="roleInterest"
          required
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option value="">Select...</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block font-mono text-sm text-[var(--color-text-muted)] mb-[var(--space-sm)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-accent)]/20 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
        />
      </div>
      {status === "success" && (
        <p className="text-[var(--color-accent)] font-mono text-sm">
          Thank you! We&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-400 font-mono text-sm">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] font-mono text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {status === "loading" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
