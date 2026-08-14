import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ContentComingSoon } from "@/components/content/ContentComingSoon";

const features = [
  {
    title: "Faculty spotlights",
    description:
      "Profiles of Penn neuroscience faculty — their labs, breakthroughs, and the questions driving their research.",
  },
  {
    title: "Lab highlights",
    description:
      "Behind-the-scenes looks at how experiments are designed, run, and what they reveal about the brain.",
  },
  {
    title: "Graduate voices",
    description:
      "Stories from grad students and early-career researchers navigating the frontiers of brain science.",
  },
];

const placeholders = [
  {
    tag: "Spotlight",
    title: "Neurodegeneration research",
    subtitle: "How Penn labs are tackling Alzheimer's, Parkinson's, and related conditions.",
  },
  {
    tag: "Lab tour",
    title: "Cognition & behavior",
    subtitle: "Studying decision-making, emotion, and the neural circuits behind everyday thought.",
  },
  {
    tag: "Profile",
    title: "A day in the lab",
    subtitle: "What graduate research in neuroscience actually looks like at Penn.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <ContentComingSoon
          label="Research"
          title="Research Spotlight"
          description="Faculty interviews, lab highlights, and graduate student profiles — the people and projects shaping neuroscience at Penn."
          features={features}
          placeholders={placeholders}
          ctaTitle="Interested in writing about research?"
          ctaDescription="We need writers who can translate lab work into stories anyone can understand. Science background optional."
          ctaHref="/get-involved"
          ctaLabel="Join as a Writer"
          visual="research"
        />
        <Footer />
      </main>
    </>
  );
}
