import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
