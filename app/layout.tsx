import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import { getViewer } from "@/lib/auth/profile";
import { AccountPillSwitcher } from "@/components/home/AccountPillSwitcher";
import { SponsorFooter } from "@/components/ui/SponsorFooter";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIFTSCAPE | Sulfuria Hardcore ",
  description: "60 Days Zombie Apocalypse Factions Hardcore Challenge",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-mc-body">
        {viewer && <AccountPillSwitcher viewer={viewer} />}
        {children}
        <SponsorFooter />
      </body>
      <Analytics />
    </html>
  );
}
