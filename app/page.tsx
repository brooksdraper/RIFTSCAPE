import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { SurvivorsProgress } from "@/components/home/SurvivorsProgress";
import { EnrolledSection } from "@/components/home/EnrolledSection";
import { getRiftscapeCoreStatus } from "@/lib/server-status";

export default async function Home() {
  const status = await getRiftscapeCoreStatus();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden">
      <BackgroundOverlay opacityClass="opacity-60" />
      <HeroSection status={status} />
      <FeatureGrid />
      <SurvivorsProgress />
      <EnrolledSection />
    </main>
  );
}
