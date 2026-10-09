import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { IssueTwoPreview } from "@/components/articles/IssueTwoPreview";
import { issueTwoPreview as article } from "@/data/issue-two-preview";

export const metadata: Metadata = {
  title: `${article.title}: ${article.subtitle} | Penn Grey Matters`,
  description: `Forthcoming in Issue Two. ${article.title}: ${article.subtitle}. Authored by ${article.author}.`,
  openGraph: {
    title: `${article.title}: ${article.subtitle}`,
    description: `Coming in Issue Two · Authored by ${article.author}`,
    images: [{ url: article.image, width: article.width, height: article.height, alt: article.imageAlt }],
  },
};
export default function UpcomingArticlePage() {
  return <><Navigation /><main className="issue-two-page pt-[var(--main-top-offset)]"><IssueTwoPreview fullPage /></main><Footer /></>;
}
