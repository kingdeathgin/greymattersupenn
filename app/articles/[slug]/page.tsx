import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { RelatedArticlesCarousel } from "@/components/articles/RelatedArticlesCarousel";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";
import { articleBodies } from "@/data/article-bodies";
import team from "@/data/team.json";

const sectionHeadings = new Set([
  "What is Intellectual Prime?",
  "Neurological Basis of Intelligence",
  "Psychological Basis of Intelligence",
  "Can intelligence be improved?",
  "Introduction",
  "What parts of the brain shrink?",
  "How does it affect us?",
  "Preventative Measures",
  "Conclusion",
  "Improved Reserve",
  "Executive Function",
  "Memory Formation and Recall",
  "Degrees of Multilingualism",
  "Impacts on Neurodegenerative Diseases",
]);

const importantPassageStarts: Record<string, string[]> = {
  "truth-behind-intelligence": [
    "While these trends provide key information",
    "Intelligence should not be viewed as a static concept",
  ],
  "written-in-our-genes": [
    "Taken together, the evidence suggests a constant interaction between nature and nurture",
  ],
  "altered-mitochondrial-trafficking": [
    "Neuronal survival and function depend on mitochondrial trafficking",
  ],
  "the-shrinking-brain": [
    "Nevertheless, even though our brains shrink with age, they keep their structural integrity and functional resilience",
  ],
  "thinking-in-tongues": [
    "As our population grows increasingly older, neurogerontological conditions become far more prominent",
  ],
  "the-accelerating-clock": [
    "Taken together, these findings suggest that the acceleration of time is a multifaceted interplay",
  ],
};

const articleSummaries: Record<string, string> = {
  "truth-behind-intelligence": "Intelligence does not peak at one universal age or arise from a single trait. Brain development balances growth, pruning, and efficiency, while genes, learning, nutrition, exercise, and environment all shape cognitive potential over time.",
  "written-in-our-genes": "Genes strongly influence cognition, personality, and vulnerability to addiction, but they do not determine a life outcome. Epigenetics, education, support, and lived experience influence how genetic predispositions are expressed.",
  "altered-mitochondrial-trafficking": "Mitochondria must travel through neurons to supply energy and regulate calcium at synapses. When this transport fails, it can contribute to the synaptic dysfunction and cell loss seen in Alzheimer’s, Parkinson’s, and Huntington’s disease.",
  "the-shrinking-brain": "Brain volume naturally declines with age, especially in regions important for memory and executive function. Exercise, cardiovascular health, and mental stimulation can support resilience, and normal aging does not make neurodegenerative disease inevitable.",
  "thinking-in-tongues": "Multilingualism may help preserve cognitive reserve, executive function, and memory as people age. The benefits appear strongest with sustained engagement in multiple—and more linguistically distinct—languages, though language learning is not a cure for neurodegenerative disease.",
  "the-accelerating-clock": "Time may feel faster with age because dopamine-dependent timing circuits slow, attention shifts, routine memories compress, neural processing changes, and circadian signals weaken. Novel experiences and deliberate attention may help make remembered time feel richer and longer.",
};

const articleIllustrations: Record<string, Array<{ after: string; src: string; alt: string }>> = {
  "truth-behind-intelligence": [
    {
      after: "Newton did it all in 18 months.",
      src: "/images/articles/inline/intelligence-newton.png",
      alt: "Illustration of Isaac Newton with an apple, prism, and telescope",
    },
    {
      after: "Since birth, the brain undergoes the process of neurogenesis",
      src: "/images/articles/inline/intelligence-synapse.png",
      alt: "Watercolor illustration of neurons communicating across a synapse",
    },
    {
      after: "One such notable shift in intelligence was the introduction of the g factor",
      src: "/images/articles/inline/intelligence-framework.png",
      alt: "Watercolor illustration of an intelligence framework with a brain at its center",
    },
  ],
  "written-in-our-genes": [
    {
      after: "One of the most famous cases from this research was that of the “Jim twins,”",
      src: "/images/articles/inline/genes-jim-twins.png",
      alt: "Hand-drawn portrait of the Jim twins standing together",
    },
    {
      after: "This question becomes further pervasive when certain genetic syndromes substantiate",
      src: "/images/articles/inline/genes-chromosome-dna.png",
      alt: "Hand-drawn chromosome with a magnified DNA double helix",
    },
    {
      after: "Another strong case for the influence of genes comes from studies on addiction.",
      src: "/images/articles/inline/genes-addiction.png",
      alt: "Hand-drawn cigarette pack illustrating genetic vulnerability to addiction",
    },
  ],
  "altered-mitochondrial-trafficking": [
    {
      after: "In healthy neurons, mitochondrial transport is needed to keep neurons alive",
      src: "/images/articles/inline/mitochondrial-ap-v2.png",
      alt: "Hand-painted mitochondrion beneath an arc labeled AP",
    },
    {
      after: "Calcium-sensitive adaptor proteins like Miro",
      src: "/images/articles/inline/mitochondrial-synapse-v2.png",
      alt: "Pastel illustration of synaptic signaling across a cell membrane",
    },
  ],
  "the-shrinking-brain": [
    {
      after: "Our brains are not fully developed until age 25",
      src: "/images/articles/inline/shrinking-brain-aging-tree.png",
      alt: "A brain-shaped tree illustrating changes from youth to older age",
    },
    {
      after: "Regular exercise, maintaining a healthy diet",
      src: "/images/articles/inline/shrinking-brain-exercise.png",
      alt: "Hand-drawn dumbbell surrounded by energetic watercolor washes",
    },
  ],
  "thinking-in-tongues": [
    {
      after: "The development of speaking fluency in two or more languages",
      src: "/images/articles/inline/thinking-in-tongues-cognitive-chart.png",
      alt: "Four hand-drawn charts comparing cognitive performance in monolingual and multilingual people",
    },
  ],
  "the-accelerating-clock": [
    {
      after: "Alongside the slowing of the biological pacemaker",
      src: "/images/articles/inline/accelerating-clock-attention-model.png",
      alt: "Hand-drawn flowchart of arousal, attention, and attentional switching",
    },
  ],
};

function getContributors(author: string, artist: string) {
  const nameAliases: Record<string, string> = {
    "Jeffery Batres": "Jeffrey Batres",
  };

  return [...author.split(/\s+and\s+|,\s*/), artist]
    .filter((name, index, names) => name && names.indexOf(name) === index)
    .map((name) => {
      const teamMember = team.find((member) => member.name === (nameAliases[name] ?? name));
      return {
        name,
        image: teamMember?.image,
        initials: name
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
    });
}

function formatCitations(text: string) {
  const withCitationMarkers = text
    .replace(/([a-z).,;:!?…”])\s*(\d{1,2}(?:\s*,\s*\d{1,2})*)(?=[.\s]|$)/g, "$1⟦$2⟧")
    .replace(/(\s)(\d{1,2}(?:\s+\d{1,2})+)(?=\s+[A-Z])/g, (_, space, numbers) => (
      `${space}${numbers.split(/\s+/).map((number: string) => `⟦${number}⟧`).join("")}`
    ));

  return withCitationMarkers.split(/(⟦[\d,\s]+⟧)/g).map((part, index) => {
    const citation = part.match(/^⟦([\d,\s]+)⟧$/);
    return citation ? (
      <sup key={index} className="ml-0.5 align-super font-mono text-[0.65em] leading-none text-[var(--color-accent)]">
        {citation[1]}
      </sup>
    ) : part;
  });
}

function separateSectionHeadings(text: string) {
  return [...sectionHeadings].reduce((content, heading) => {
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return content.replace(new RegExp(`\\n${escapedHeading}\\s*\\n`, "g"), `\n\n${heading}\n\n`);
  }, text);
}

function ArticleBody({ slug }: { slug: string }) {
  const body = articleBodies[slug];

  if (!body) {
    return (
      <p className="text-[var(--color-text-primary)]">
        Full article content will be available soon.
      </p>
    );
  }

  const bibliographySeparator = "\n\nBibliography\n\n";
  const compactBibliographySeparator = "\nBibliography\n";
  const referencesSeparator = "\n\nReferences\n";
  const compactReferencesSeparator = "\nReferences\n";
  const firstArticleReferences = "\n\nZiegler P. The Black Death.";
  const referenceSeparator = [bibliographySeparator, compactBibliographySeparator, referencesSeparator, compactReferencesSeparator, firstArticleReferences]
    .find((separator) => body.includes(separator)) ?? "";
  const referenceStart = body.indexOf(referenceSeparator);
  const articleText = referenceStart === -1 ? body : body.slice(0, referenceStart);
  const referencesText = referenceStart === -1
    ? ""
    : body.slice(referenceStart + referenceSeparator.length);
  const [, ...bodyLines] = articleText.split("\n");
  const blocks = separateSectionHeadings(bodyLines.join("\n"))
    .split(/\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  const references = referencesText
    ? `${referenceSeparator === firstArticleReferences ? "Ziegler P. The Black Death." : ""}${referencesText}`
        .split("\n")
        .filter(Boolean)
    : [];
  const importantPassages = importantPassageStarts[slug] ?? [];
  const illustrations = articleIllustrations[slug] ?? [];

  return (
    <>
      {blocks.map((block, index) => {
        const text = block.replace(/\s*\n\s*/g, " ").trim();
        if (!text) return null;

        if (sectionHeadings.has(text)) {
          return (
            <h2
              key={index}
              className="font-display text-3xl font-light text-[var(--color-text-primary)] mt-14 mb-5"
            >
              {text}
            </h2>
          );
        }

        if (importantPassages.some((passageStart) => text.startsWith(passageStart))) {
          return (
            <aside
              key={index}
              className="my-12 rounded-sm border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-6 py-7 font-display text-2xl leading-relaxed text-[var(--color-text-primary)] md:px-9 md:py-8 md:text-3xl"
            >
              <span className="mb-3 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Key idea
              </span>
              {formatCitations(text)}
            </aside>
          );
        }

        if (text.startsWith("“")) {
          return (
            <blockquote
              key={index}
              className="my-10 border-l-2 border-[var(--color-accent)] pl-6 font-display text-2xl leading-relaxed text-[var(--color-text-primary)] md:pl-8 md:text-3xl"
            >
              {formatCitations(text)}
            </blockquote>
          );
        }

        const illustration = illustrations.find(({ after }) => text.startsWith(after));

        return (
          <div key={index}>
            <p>{formatCitations(text)}</p>
            {illustration && (
              <figure className="my-12 overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-bg)] shadow-2xl shadow-black/20">
                <Image
                  src={illustration.src}
                  alt={illustration.alt}
                  width={1672}
                  height={941}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full"
                />
              </figure>
            )}
          </div>
        );
      })}

      {references.length > 0 && (
        <section className="mt-16 border-t border-[var(--color-border)] pt-10" aria-labelledby="references-title">
          <h2 id="references-title" className="font-display text-3xl font-light text-[var(--color-text-primary)] mb-6">
            References
          </h2>
          <ol className="list-decimal space-y-3 pl-6 text-base">
            {references.map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();
  const contributors = getContributors(article.author, article.artist);
  const hasBlackBackground = article.slug === "the-accelerating-clock";

  return (
    <>
      <Navigation />
      <main className={`min-h-screen pt-[var(--main-top-offset)] ${hasBlackBackground ? "bg-black" : ""}`}>
        <article className="pb-16 md:pb-24">
          {/* Featured image */}
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${hasBlackBackground ? "from-black via-black/60" : "from-[var(--color-bg)] via-[var(--color-bg)]/60"}`} />
          </div>

          <div className="px-4 md:px-8 -mt-24 relative z-10">
            <div className="max-w-[var(--content-max)] mx-auto">
              <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href="/articles"
                  className="font-mono text-sm text-[var(--color-accent)] hover:underline"
                >
                  ← Back to Articles
                </Link>
                <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-[0.16em]">
                  {article.category}
                </span>
              </div>
              <h1 className="max-w-5xl font-display text-4xl font-light leading-[1.08] text-[var(--color-text-primary)] md:text-6xl">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mt-5 max-w-4xl font-body text-lg text-[var(--color-text-muted)] md:text-xl">
                  {article.subtitle}
                </p>
              )}
              <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-[var(--color-text-muted)]">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.comingSoon ? "Article forthcoming" : `${article.readingTime} min read`}</span>
                <span>•</span>
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3" aria-label="Article contributors">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Contributors
                </span>
                <div className="flex -space-x-2">
                  {contributors.map((contributor) => (
                    <span
                      key={contributor.name}
                      title={contributor.name}
                      aria-label={contributor.name}
                      className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)] font-mono text-[0.6rem] font-bold text-[var(--color-bg)]"
                    >
                      {contributor.image ? (
                        <Image
                          src={contributor.image}
                          alt={contributor.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : contributor.initials}
                    </span>
                  ))}
                </div>
                <span className="font-body text-sm text-[var(--color-text-muted)]">
                  {contributors.map((contributor) => contributor.name).join(" · ")}
                </span>
              </div>
              {articleSummaries[article.slug] && (
                <aside className="mt-8 max-w-3xl border-l-2 border-[var(--color-accent)] pl-5 md:pl-6" aria-label="Article summary">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">At a glance</p>
                  <p className="mt-2 font-body text-base leading-relaxed text-[var(--color-text-primary)] md:text-lg">
                    {articleSummaries[article.slug]}
                  </p>
                </aside>
              )}
            </div>
          </div>

          <div className="px-4 md:px-8 mt-12">
            <div className="mx-auto max-w-3xl">
              <div className="font-body text-[1.08rem] leading-[1.9] text-[var(--color-text-muted)] prose prose-invert max-w-none md:text-xl">
                <ArticleBody slug={article.slug} />
              </div>
            </div>
          </div>

          <RelatedArticlesCarousel articles={articles} currentSlug={article.slug} />
        </article>
        <Footer />
      </main>
    </>
  );
}
