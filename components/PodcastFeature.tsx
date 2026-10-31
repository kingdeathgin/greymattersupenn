import Image from "next/image";
import { firstPodcast as podcast } from "@/data/podcast";

export function PodcastFeature({ fullPage = false }: { fullPage?: boolean }) {
  const Heading = fullPage ? "h1" : "h2";
  return (
    <section className={`podcast-feature ${fullPage ? "podcast-full" : ""}`} aria-labelledby="podcast-feature-heading">
      <div className="feature-editorial-inner">
        <p className="feature-section-label">The podcast</p>
        <div className="podcast-editorial-layout">
          <figure className="podcast-recording">
            <Image src="/images/podcast/recording-room.jpg" alt="The Grey Matters recording room, with microphones and cameras around a table and a brain illustration projected under pink lighting" width={1824} height={1368} sizes="(max-width: 700px) 100vw, 55vw" />
            <figcaption>Behind the scenes · Recorded October 30, 2026</figcaption>
          </figure>
          <div className="podcast-copy">
            <p className="podcast-series">{podcast.name} · Episode {podcast.episode}</p>
            <Heading id="podcast-feature-heading">In conversation with {podcast.guest}</Heading>
            <p className="podcast-description">{podcast.description}</p>
          <dl className="podcast-episode-details">
            <div><dt>Release</dt><dd>{podcast.releaseWindow}</dd></div>
            <div><dt>Next conversation</dt><dd>{podcast.nextGuest}</dd></div>
          </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
