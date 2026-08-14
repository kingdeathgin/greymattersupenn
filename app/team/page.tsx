import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import team from "@/data/team.json";

const leadershipRoles = ["Editor-in-Chief", "Director of Operations", "Director of Finance"];
const leadership = team.filter((m) => leadershipRoles.includes(m.role));
const rest = team.filter((m) => !leadershipRoles.includes(m.role));

export default function TeamPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Meet The Team
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12 max-w-2xl">
              The people behind Penn Grey Matters.
            </p>

            {/* Leadership */}
            {leadership.length > 0 && (
              <div className="mb-16">
                <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-8">
                  Leadership
                </h2>
                <div className="flex flex-wrap gap-x-12 gap-y-10 justify-start">
                  {leadership.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-5 group"
                    >
                      {"image" in member && member.image && (
                        <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden ring-2 ring-[var(--color-accent)]/20 group-hover:ring-[var(--color-accent)]/50 transition-all">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="96px"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-light text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                          {member.name}
                        </h3>
                        <span className="font-mono text-sm text-[var(--color-text-muted)]">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team */}
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-8">
                Team
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {rest.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col items-center text-center group"
                  >
                    {"image" in member && member.image && (
                      <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-full overflow-hidden ring-2 ring-[var(--color-accent)]/15 group-hover:ring-[var(--color-accent)]/40 transition-all mb-3">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="112px"
                        />
                      </div>
                    )}
                    <h3 className="font-display text-base font-light text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      {member.name}
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-text-muted)] mt-0.5 block">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
