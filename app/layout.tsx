import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import { getCurrentProfile } from "@/lib/profile";
import { AccountPillSwitcher } from "@/components/home/AccountPillSwitcher";
import { SponsorFooter } from "@/components/ui/SponsorFooter";
import "./globals.css";

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
  description: "100 Days Zombie Apocalypse Factions Hardcore Challenge",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-mc-body">
        <AccountPillSwitcher profile={profile} />
        {children}
        <SponsorFooter />
      </body>
    </html>
  );
}
