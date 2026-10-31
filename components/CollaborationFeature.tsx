import Image from "next/image";

const ARTICLE_URL = "https://medium.com/@nusmedtech.official/brain-computer-interfaces-in-modern-medicine-18679bf123a9";

export function CollaborationFeature() {
  return (
    <section id="collaboration" aria-labelledby="collaboration-title" className="collaboration-feature">
      <div className="feature-editorial-inner">
        <p className="feature-section-label">Collaborations</p>
        <div className="collaboration-layout">
          <figure>
            <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" aria-label="Read Brain-Computer Interfaces in Modern Medicine on Medium" className="collaboration-art">
              <Image src="/images/articles/bci-collaboration-original.png" alt="Aarna Mishra’s illustration of a person wearing a brain-computer interface, a neural network, a robotic hand, and robotic legs" width={1536} height={1095} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
            </a>
            <figcaption>Illustration by Aarna Mishra</figcaption>
          </figure>
          <article>
            <p className="collaboration-partners">Penn Grey Matters × NUS Medtech</p>
            <h2 id="collaboration-title">Brain-Computer Interfaces in Modern Medicine</h2>
            <p className="collaboration-description">How can brain activity help someone move a hand, use a computer, or communicate? Together with NUS Medtech, we explore the medical applications of brain–computer interfaces and the algorithms behind them.</p>
            <div className="collaboration-credits">
              <p>By Mubina Shahnaz &amp; Elgin Tawiah</p>
              <p>Edited by Jeffrey Bartes</p>
            </div>
            <a href={ARTICLE_URL} target="_blank" rel="noopener noreferrer" className="feature-text-link">Read the article <span aria-hidden="true">↗</span></a>
            <p className="collaboration-publication">Medium · September 18, 2026 · 9 min read</p>
          </article>
        </div>
      </div>
    </section>
  );
}
