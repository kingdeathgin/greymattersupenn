import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { Mindwalk } from "@/components/games/Mindwalk";
export const metadata: Metadata = { title: "Mindwalk | Penn Grey Matters", description: "A little lost in thought. Remember the maze, collect three thoughts, and find your way out in Penn Grey Matters’ daily memory game." };
export default function GamePage() {
  return <><Navigation /><main className="mindwalk-page min-h-screen px-4 pb-16 pt-28 md:px-8 md:pb-24"><Mindwalk /></main><Footer /></>;
}
