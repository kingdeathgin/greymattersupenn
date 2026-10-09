import Image from "next/image";
import Link from "next/link";
import { firstPodcast as podcast } from "@/data/podcast";

export function PodcastFeature({ fullPage = false }: { fullPage?: boolean }) {
  const Heading = fullPage ? "h1" : "h2";
  return (
    <section className={`podcast-feature ${fullPage ? "podcast-full" : ""}`} aria-labelledby="podcast-feature-heading">
      <div className="podcast-inner">
        <div className="podcast-masthead"><span>PENN GREY MATTERS / PODCAST</span><span>EPISODE {podcast.episode}</span></div>
        <div className="podcast-layout">
          <div className="podcast-copy">
            <p className="podcast-series">{podcast.name}</p>
            <Heading id="podcast-feature-heading">In conversation<br/>with <em>{podcast.guest}.</em></Heading>
            <p className="podcast-role">{podcast.role}</p>
            <p className="podcast-description">{podcast.description}</p>
            <p className="podcast-description">{podcast.background}</p>
            <div className="podcast-date"><span>INTERVIEW SCHEDULED</span><time dateTime={podcast.interviewDate}>{podcast.displayDate}</time></div>
            <div className="podcast-actions">
              <span className="podcast-status"><span aria-hidden="true"/> Episode forthcoming</span>
              {!fullPage && <Link href="/podcast">Meet our first guest <span aria-hidden="true">↗</span></Link>}
            </div>
            {fullPage && <div className="podcast-sources"><a href={podcast.profile} target="_blank" rel="noreferrer">Penn profile ↗</a><a href={podcast.lab} target="_blank" rel="noreferrer">Kording Lab ↗</a></div>}
          </div>
          <figure className="podcast-portrait">
            <div className="podcast-photo-frame"><Image src={podcast.image} alt="Konrad Kording wearing black glasses, with bright blue hair." width={554} height={554} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 42vw, 480px" priority={fullPage}/></div>
            <figcaption><span>{podcast.guest}</span><span>Photo: University of Pennsylvania</span></figcaption>
            <div className="podcast-wave" aria-hidden="true">{[14,27,18,40,59,34,69,47,26,61,78,43,23,55,72,32,65,46,25,51,33,16,29,12].map((h,i)=><i key={i} style={{height:h}}/>)}</div>
          </figure>
        </div>
      </div>
    </section>
  );
}
