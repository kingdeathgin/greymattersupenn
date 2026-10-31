import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ApplicationUpdateForm } from "./ApplicationUpdateForm";

export const metadata: Metadata = {
  title: "Application Update | Penn Grey Matters",
  robots: { index: false, follow: false },
};

export default function ApplicationUpdatePage() {
  return (
    <>
      <Navigation />
      <main id="main-content" tabIndex={-1} className="min-h-screen pt-[var(--main-top-offset)]">
        <ApplicationUpdateForm />
        <Footer />
      </main>
    </>
  );
}
