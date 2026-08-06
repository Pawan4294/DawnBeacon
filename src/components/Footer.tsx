"use client";

import { motion } from "framer-motion";
import { ExternalLink, Radio } from "lucide-react";
import { DAWN_LINKS } from "@/data/dawnFacts";
import type { TabId } from "@/app/page";

interface FooterProps {
  onTabChange: (tab: TabId) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  return (
    <footer
      className="relative z-10 mt-12 border-t px-4 py-8"
      style={{
        borderColor: "rgba(233,108,56,0.1)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E96C38, #c4541d)" }}
            >
              <Radio size={16} color="white" />
            </div>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <span className="text-[#E96C38]">Dawn</span>Beacon
              </p>
              <p className="text-[11px] text-white/40">Independent community tool</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm text-white/50">
            <a href={DAWN_LINKS.mainSite} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors">
              <ExternalLink size={11} /> DAWN Internet
            </a>
            <a href={DAWN_LINKS.rewardsSystem} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors">
              <ExternalLink size={11} /> Rewards System
            </a>
            <a href={DAWN_LINKS.validatorExtension} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors">
              <ExternalLink size={11} /> Extension
            </a>
            <a href={DAWN_LINKS.whitepaper} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors">
              <ExternalLink size={11} /> Whitepaper
            </a>
            <button onClick={() => onTabChange("about")}
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors text-left">
              Privacy Policy
            </button>
            <button onClick={() => onTabChange("about")}
              className="flex items-center gap-1 hover:text-[#E96C38] transition-colors text-left">
              About
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-xs text-white/25"
          style={{ borderColor: "rgba(233,108,56,0.08)" }}>
          <p>
            DawnBeacon is an independent, unofficial community tool. Not affiliated with or endorsed by DAWN Internet.
            All reward mechanics trace to DAWN&apos;s published sources. No numbers are invented or estimated.
          </p>
          <p className="mt-1 text-white/20">
            Map data © OpenStreetMap contributors • Geocoding via Nominatim
          </p>
        </div>
      </div>
    </footer>
  );
}
