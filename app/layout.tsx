import "./globals.css";

import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const BricolageFont = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farm2Table - Where local food meets modern connection",
  description:
    "Join the Farm2Table waitlist to connect with local farmers and access fresh, locally-sourced produce. Be the first to know when we launch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={BricolageFont.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
