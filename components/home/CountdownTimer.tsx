"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDateString?: string;
}

export function CountdownTimer({ targetDateString = "2026-08-21T00:00:00Z" }: CountdownTimerProps) {
  const targetDate = new Date(targetDateString).getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="flex gap-2 sm:gap-3 mb-16"
    >
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINS", value: timeLeft.minutes },
        { label: "SECS", value: timeLeft.seconds },
      ].map((item, i) => (
        // Each unit is an inventory slot: recessed bevel, count in the corner
        <div
          key={i}
          className="mc-panel-raised pixel-corners pixel-slot flex flex-col items-center justify-center w-[72px] h-[72px] sm:w-24 sm:h-24"
        >
          <span className="font-mc-header text-2xl sm:text-4xl text-accent mc-text-shadow leading-none">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="font-mc-sub text-[9px] sm:text-[10px] text-foreground/50 tracking-widest mt-2">
            {item.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
