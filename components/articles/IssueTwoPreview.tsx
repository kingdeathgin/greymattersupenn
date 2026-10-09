import Image from "next/image";
import Link from "next/link";
import { issueTwoPreview as article } from "@/data/issue-two-preview";

export function IssueTwoPreview({ fullPage = false }: { fullPage?: boolean }) {
  const Heading = fullPage ? "h1" : "h2";
  return (
    <section className={`issue-two-preview ${fullPage ? "issue-two-full" : ""}`} aria-labelledby="issue-two-preview-heading">
      <div className="issue-two-inner">
        <div className="issue-two-heading-row">
          <span>ISSUE TWO</span>
          <span>ARTICLE 01 · FORTHCOMING</span>
        </div>
        <div className="issue-two-layout">
          <figure className="issue-two-art">
            <Image
              src={article.image}
              alt={article.imageAlt}
              width={article.width}
              height={article.height}
              sizes="(max-width: 700px) 92vw, (max-width: 1100px) 48vw, 560px"
              priority={fullPage}
            />
          </figure>
          <div className="issue-two-copy">
            <p className="issue-two-eyebrow">A first look</p>
            <Heading id="issue-two-preview-heading">
              {article.title}<span className="sr-only">: </span>
              <span className="issue-two-subtitle">{article.subtitle}</span>
            </Heading>
            <p className="issue-two-byline">Authored by <strong>{article.author}</strong></p>
            <div className="issue-two-status"><span aria-hidden="true"/> Coming in Issue Two</div>
            {fullPage && (
              <Link className="issue-two-link" href="/articles">
                Explore the archive <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
