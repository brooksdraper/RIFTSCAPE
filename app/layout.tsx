import type { Metadata } from "next";
import { headers } from "next/headers";
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
  description: "100 Days Zombie Apocalypse Factions Hardcore Challenge",
};

/**
 * Routes rendered inside the Minecraft client rather than in a browser. They
 * are a game screen, not a page of the site, so the account pill and the
 * sponsor footer stay off them. `proxy.ts` supplies the path as `x-pathname`.
 */
const IN_GAME_ROUTES = new Set(["/server"]);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const inGame = IN_GAME_ROUTES.has(pathname);

  // The screen renders its own survivor plate, so skip the lookup entirely.
  const viewer = inGame ? null : await getViewer();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-mc-body">
        {viewer && <AccountPillSwitcher viewer={viewer} />}
        {children}
        {!inGame && <SponsorFooter />}
      </body>
      <Analytics />
    </html>
  );
}
