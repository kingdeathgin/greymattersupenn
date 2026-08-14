import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/nav/Navigation";

const APPLICATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc7I3BGZ3JpGkf5zKyMBuqjDsCq-CwdV8mUsLcb05tBS51ILQ/viewform";

const roles = ["Writers", "Designers", "Researchers", "Podcast Hosts", "Developers"];

export default function GetInvolvedPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen overflow-hidden pt-[var(--main-top-offset)] bg-[var(--color-bg)]">
        <section className="relative px-4 py-20 md:px-8 md:py-28">
          <div
            className="absolute inset-0 pointer-events-none opacity-70"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 55% 55% at 18% 28%, rgba(0, 229, 255, 0.12), transparent 72%), radial-gradient(ellipse 45% 45% at 85% 70%, rgba(155, 93, 229, 0.12), transparent 72%)",
            }}
          />
          <div className="relative max-w-[var(--wide-max)] mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-24 items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-accent)] mb-5">
                Join Penn Grey Matters
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl md:text-7xl leading-[1.04] text-[var(--color-text-primary)] max-w-3xl">
                Come work with us.
              </h1>
              <p className="font-body text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mt-7">
                Penn Grey Matters is a student-run publication for people who
                want to share neuroscience in clear, interesting ways. No
                neuroscience major required.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-3 mt-9 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                {roles.map((role) => (
                  <span key={role} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-l-0 lg:border-l border-[var(--color-accent)]/20 lg:pl-14">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-accent)]">
                Applications open
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-light leading-tight text-[var(--color-text-primary)] mt-4">
                Interested in joining?
              </h2>
              <p className="font-body text-[var(--color-text-muted)] mt-5">
                Fill out the interest form and tell us a little about yourself.
                We&apos;ll read it and get back to you.
              </p>
              <a
                href={APPLICATION_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 mt-8 px-7 py-4 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-bg)] font-mono text-sm uppercase tracking-wider hover:scale-[1.02] hover:opacity-90 transition-all"
              >
                Start application
                <span aria-hidden="true">↗</span>
              </a>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] mt-5">
                Opens in a new tab
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--color-accent)]/10 px-4 py-10 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            {[
              ["01", "Bring what you know", "We welcome experience, but you do not need it to get started."],
              ["02", "Learn alongside people", "Work with a team of students who care about science and communication."],
              ["03", "Make something useful", "Help turn research into work that more people can understand."],
            ].map(([number, title, description]) => (
              <div key={number}>
                <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-accent)]">{number}</p>
                <h2 className="font-display text-xl font-light text-[var(--color-text-primary)] mt-3">{title}</h2>
                <p className="font-body text-sm text-[var(--color-text-muted)] mt-2 max-w-xs mx-auto sm:mx-0">{description}</p>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
