"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/podcast", label: "Podcast" },
  { href: "/research", label: "Research" },
  { href: "/chapters", label: "Chapters" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/get-involved", label: "Join" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] px-4 py-4 md:px-8"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
        >
          <Image src="/main-image.png" alt="Penn Grey Matters" width={48} height={30} className="object-contain" />
          Penn Grey Matters
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-[var(--space-lg)] font-mono text-sm uppercase text-[var(--color-text-muted)]" style={{ letterSpacing: "0.08em" }}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-[var(--color-text-primary)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-[var(--space-md)] py-[var(--space-lg)] font-mono text-sm uppercase text-[var(--color-text-muted)]" style={{ letterSpacing: "0.08em" }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block hover:text-[var(--color-accent)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
