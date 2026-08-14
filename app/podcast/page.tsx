import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ContentComingSoon } from "@/components/content/ContentComingSoon";

const features = [
  {
    title: "Faculty conversations",
    description:
      "Long-form interviews with Penn neuroscience researchers on their work, discoveries, and what drew them to the brain.",
  },
  {
    title: "Accessible deep dives",
    description:
      "Complex topics broken down without dumbing them down — built for curious students and lifelong learners alike.",
  },
  {
    title: "New episodes regularly",
    description:
      "We're building a library of conversations across cognition, disease, technology, and the mind.",
  },
];

const placeholders = [
  {
    tag: "Episode 01",
    title: "Inside the lab",
    subtitle: "A Penn faculty member on what neuroscience research looks like day to day.",
  },
  {
    tag: "Episode 02",
    title: "Memory & the mind",
    subtitle: "How we study learning, forgetting, and what makes memories stick.",
  },
  {
    tag: "Episode 03",
    title: "From bench to bedside",
    subtitle: "Translating brain science into treatments that help real patients.",
  },
];

export default function PodcastPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <ContentComingSoon
          label="Podcast"
          title="Grey Frequencies"
          description="Conversations with Penn faculty and researchers — neuroscience explained through the people who study it."
          features={features}
          placeholders={placeholders}
          ctaTitle="Want to host or produce?"
          ctaDescription="We're looking for podcast hosts, audio editors, and interviewers. No experience required — just curiosity."
          ctaHref="/get-involved"
          ctaLabel="Get Involved"
          visual="podcast"
        />
        <Footer />
      </main>
    </>
  );
}
