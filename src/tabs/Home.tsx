"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Map, Zap, Shield, Globe, ChevronDown } from "lucide-react";
import { DAWN_LINKS, EXTENSION_REWARDS, DISCLAIMERS } from "@/data/dawnFacts";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { TabId } from "@/app/page";

interface HomeProps {
  onTabChange: (tab: TabId) => void;
}

const words = ["Rooftop", "Shop", "School", "Building", "Location"];

export default function HomeTab({ onTabChange }: HomeProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(words[0].length);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex === words[wordIndex].length) {
        setTimeout(() => setIsDeleting(true), 1200);
        return;
      }
      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
      if (isDeleting) {
        setCharIndex((c) => c - 1);
        setDisplayWord(words[wordIndex].slice(0, charIndex - 1));
      } else {
        setCharIndex((c) => c + 1);
        setDisplayWord(words[wordIndex].slice(0, charIndex + 1));
      }
    }, isDeleting ? 60 : 100);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  const features = [
    {
      icon: <Compass size={22} />,
      title: "Check My Fit",
      desc: "Get a rule-based recommendation on whether Black Box or Antenna hardware fits your situation.",
      tab: "check" as TabId,
    },
    {
      icon: <Map size={22} />,
      title: "Opportunity Map",
      desc: "Search any real-world location and see honest, factor-based fit information from live map data.",
      tab: "map" as TabId,
    },
    {
      icon: <Zap size={22} />,
      title: "Extension Rewards",
      desc: `Real reward mechanics: ${EXTENSION_REWARDS.pointsPer24Hours} points/day for staying connected. Calculate your own estimate.`,
      tab: "check" as TabId,
    },
    {
      icon: <Shield size={22} />,
      title: "Generate Your Pitch",
      desc: "Create a shareable pitch document to bring to potential hosts — shops, schools, property owners.",
      tab: "pitch" as TabId,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="pt-8 pb-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: "rgba(233,108,56,0.1)",
              border: "1px solid rgba(233,108,56,0.3)",
              color: "#E96C38",
            }}
          >
            <Globe size={12} />
            Independent Community Tool for DAWN Internet
          </motion.div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <span className="text-white">Find out if your </span>
            <br />
            <span className="text-gradient">{displayWord}</span>
            <span className="text-[#E96C38] cursor-blink">|</span>
            <br />
            <span className="text-white">can earn DAWN rewards.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Explore DAWN Internet&apos;s DePIN network opportunities with honest, source-backed data.
            Every number traces to{" "}
            <a href={DAWN_LINKS.rewardsSystem} target="_blank" rel="noopener noreferrer"
              className="text-[#E96C38] hover:underline">
              DAWN&apos;s published reward mechanics
            </a>
            . No fabricated numbers, ever.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={() => onTabChange("check")}
            className="btn-primary flex items-center gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Compass size={18} />
            Check My Fit
            <ArrowRight size={16} />
          </motion.button>

          <motion.button
            onClick={() => onTabChange("map")}
            className="btn-secondary flex items-center gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Map size={18} />
            Explore Opportunity Map
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center pt-4"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-white/20" />
        </motion.div>
      </section>

      {/* Key Numbers Strip */}
      <motion.section
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-center text-xs text-white/40 mb-4 uppercase tracking-wider">
          Real DAWN Extension Reward Mechanics — Source:{" "}
          <a href={DAWN_LINKS.rewardsSystem} target="_blank" rel="noopener noreferrer" className="text-[#E96C38] hover:underline">
            DAWN Rewards System Blog Post
          </a>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: 1440, label: "Points per 24h connected", sub: "= 60 pts/hour", suffix: "" },
            { value: 20, label: "Tier A referral bonus", sub: "of their lifetime points", suffix: "%" },
            { value: 5000, label: "Points per social follow", sub: "X, Discord, Telegram", suffix: "" },
            { value: 3, label: "Referral tiers deep", sub: "20% / 10% / 5% ongoing", suffix: "" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-gradient number-display">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={1200} />
              </div>
              <div className="text-xs text-white/60 mt-1">{stat.label}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="space-y-4">
        <motion.h2
          className="text-2xl font-bold text-white text-center"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          What DawnBeacon Does
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat, i) => (
            <motion.button
              key={i}
              onClick={() => onTabChange(feat.tab)}
              className="glass-card glass-card-hover p-6 text-left group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)", color: "#E96C38" }}
                >
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feat.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-[#E96C38] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight size={12} />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <motion.section
        className="glass-card p-5 border border-[rgba(233,108,56,0.15)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-white/40 leading-relaxed text-center">
          ⚠️ {DISCLAIMERS.general} {DISCLAIMERS.dataAccuracy} {DISCLAIMERS.hardwareRewards}
        </p>
      </motion.section>
    </div>
  );
}
