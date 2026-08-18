"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { RulesHeader } from "@/components/rules/RulesHeader";
import { StrikeLegend } from "@/components/rules/StrikeLegend";
import { RuleSection } from "@/components/rules/RuleSection";
import { RULES_DATA } from "@/components/rules/rules-data";

export default function RulesPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    conduct: false,
    survival: false,
    faction: false,
    riftscape: false,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <main className="min-h-screen stone-bg text-foreground selection:bg-accent/30 overflow-x-hidden relative pb-28">
      {/* Background Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 max-w-6xl">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-foreground/60 hover:text-accent font-mc-sub text-xs tracking-widest uppercase transition-colors mb-8"
          >
            <span className="mr-2">←</span> Back to HQ
          </Link>
        </motion.div>

        {/* Header */}
        <RulesHeader />

        {/* Strike Legend */}
        <StrikeLegend />

        {/* Rule Categories */}
        <div className="space-y-6">
          {RULES_DATA.map((category) => (
            <RuleSection
              key={category.id}
              category={category}
              isOpen={openSections[category.id] || false}
              onToggle={() => toggleSection(category.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
