import type { Metadata } from "next";
import { Libre_Baskerville, Nunito, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mplus-rounded",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Penn Grey Matters | Making Neuroscience Accessible",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  description:
    "A student publication at the University of Pennsylvania dedicated to broadening access to neuroscience content through articles, podcasts, and interactive experiences.",
  openGraph: {
    title: "Penn Grey Matters | Making Neuroscience Accessible",
    description:
      "A student publication at the University of Pennsylvania dedicated to broadening access to neuroscience content.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penn Grey Matters | Making Neuroscience Accessible",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${nunito.variable} ${mPlusRounded.variable} ${libreBaskerville.variable}`}>
      <body className="antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
