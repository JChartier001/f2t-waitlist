import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const BricolageFont = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farm2Table - Tampa Bay's Online Farmers Market | Join the Waitlist",
  description:
    "Tampa Bay's online farmers market. Order fresh produce, meat, eggs, and more directly from local farms. Launching soon. Join the waitlist for early access.",
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
        <Analytics />
      </body>
    </html>
  );
}
