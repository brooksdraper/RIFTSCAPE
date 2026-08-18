"use client";

import { motion, AnimatePresence } from "motion/react";
import { RuleCard } from "./RuleCard";
import type { RuleCategory } from "./rules-data";

interface RuleSectionProps {
  category: RuleCategory;
  isOpen: boolean;
  onToggle: () => void;
}

export function RuleSection({ category, isOpen, onToggle }: RuleSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      {/* Section Header - Collapsible */}
      <button
        onClick={onToggle}
        className="w-full text-left mc-panel pixel-corners border-2 border-black p-4 sm:p-5 hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-accent flex-shrink-0"
              >
                <span className="font-mc-header text-lg">▶</span>
              </motion.div>
              <h2 className="font-mc-header text-lg sm:text-xl leading-tight text-foreground">
                {category.title}
              </h2>
              <span className="bg-neutral-700 border-2 border-black pixel-corners-sm text-accent font-mc-body text-[10px] px-2 py-1 flex-shrink-0">
                {category.rules.length}
              </span>
            </div>
            <p className="font-mc-body text-xs text-neutral-400 mt-2 ml-8">
              {category.subtitle}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {category.rules.map((rule, index) => (
                  <RuleCard key={rule.id} rule={rule} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
