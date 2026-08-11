import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { EnrolledSection } from "@/components/home/EnrolledSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden">
      <BackgroundOverlay opacityClass="opacity-30" />
      <HeroSection />
      <FeatureGrid />
      <EnrolledSection />
    </main>
  );
}
