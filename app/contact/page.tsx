"use client";

import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--content-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Contact
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12">
              Get in touch with the Penn Grey Matters team.
            </p>
            <ContactForm />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
