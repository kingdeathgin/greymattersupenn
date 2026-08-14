"use client";

import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/articles", label: "Articles" },
  { href: "/explore", label: "Grey Matter" },
  { href: "/podcast", label: "Podcast" },
  { href: "/chapters", label: "Chapters" },
  { href: "/team", label: "Team" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer
      className="py-16 px-4 md:px-8 border-t border-[var(--color-accent)]/10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link
              href="/"
              className="font-display text-xl font-medium text-[var(--color-text-primary)]"
            >
              Penn Grey Matters
            </Link>
            <p className="font-mono text-sm text-[var(--color-text-muted)] mt-[var(--space-sm)]">
              Making Neuroscience Accessible
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap gap-[var(--space-lg)] font-mono text-sm text-[var(--color-text-muted)]">
              {footerLinks.map((link) => (
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
          </nav>
        </div>
        <div className="mt-[var(--space-xl)] pt-[var(--space-lg)] border-t border-[var(--color-accent)]/10">
          <p className="font-mono text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Penn Grey Matters. University of Pennsylvania.
          </p>
        </div>
      </div>
    </footer>
  );
}
