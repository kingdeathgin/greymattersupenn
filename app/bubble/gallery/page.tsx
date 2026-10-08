import Link from "next/link";
import { isBubbleAdmin } from "@/lib/bubble-admin";
import { allSubmissions } from "@/lib/bubble-store";
import { GalleryLogin } from "./GalleryLogin";
import { BubbleMap } from "./BubbleMap";
import { lockGallery } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Class Bubble Map", robots: { index: false, follow: false } };

export default async function GalleryPage() {
  const authorized = await isBubbleAdmin();
  // Never load or serialize classmates' drawings before authorization.
  const submissions = authorized ? await allSubmissions().catch(() => null) : null;
  return <main className="min-h-screen bg-[#f6f2e9] px-4 py-8 text-[#243b36] sm:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex justify-between gap-4"><Link href="/bubble" className="underline">← Back to my drawing</Link>{authorized && <form action={lockGallery}><button className="underline">Lock gallery</button></form>}</div>
      {!authorized ? <GalleryLogin /> : submissions ? <BubbleMap submissions={submissions} /> : <p role="alert">The drawings couldn’t be loaded. Refresh to try again.</p>}
    </div>
  </main>;
}
