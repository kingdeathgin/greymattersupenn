import type { Metadata } from "next";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { SynapseSprint } from "@/components/games/SynapseSprint";
export const metadata: Metadata = { title: "Synapse Sprint | Penn Grey Matters", description: "An original daily deduction puzzle from Grey Matters at Penn. Crack a hidden five-signal code in six guesses and join the weekly leaderboard." };
export default function GamePage() {
  return <><Navigation /><main className="synapse-page min-h-screen px-4 pb-16 pt-28 md:px-8 md:pb-24"><SynapseSprint /></main><Footer /></>;
}
