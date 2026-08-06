"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Radio, AlertCircle, CheckCircle } from "lucide-react";
import { DAWN_LINKS, HARDWARE_FACTS, DISCLAIMERS } from "@/data/dawnFacts";
import DataDisclaimer from "@/components/DataDisclaimer";

export default function ApplyTab() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)", color: "#E96C38" }}>
            <ExternalLink size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Apply & Get Started</h2>
            <p className="text-sm text-white/50">Real links to DAWN&apos;s official store and application form</p>
          </div>
        </div>
        <DataDisclaimer message={DISCLAIMERS.general} />
      </motion.div>

      {/* Validator Extension — always first, always free */}
      <motion.div
        className="glass-card p-6 border border-[rgba(233,108,56,0.2)]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)" }}>
            <Radio size={22} className="text-[#E96C38]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-lg">Validator Extension</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(233,108,56,0.15)", color: "#E96C38", border: "1px solid rgba(233,108,56,0.3)" }}>
                FREE — No Hardware
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              The DAWN Validator Chrome Extension requires no hardware. Install it, stay connected, and
              earn reward points based on DAWN&apos;s published formula. Available to anyone worldwide.
            </p>

            <div className="space-y-2 mb-4">
              {[
                "1,440 reward points per 24-hour period for staying connected",
                "Referral bonuses: 20% / 10% / 5% across three tiers — ongoing",
                "5,000 points per social platform followed (X, Discord, Telegram)",
                "No hardware purchase needed — just install the Chrome extension",
              ].map((fact, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                  <CheckCircle size={12} className="text-[#E96C38] flex-shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>

            <a href={DAWN_LINKS.validatorExtension} target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
              <ExternalLink size={15} />
              Install Validator Extension (Chrome Web Store)
            </a>
            <p className="text-[10px] text-white/30 mt-2">
              Source:{" "}
              <a href={DAWN_LINKS.rewardsSystem} target="_blank" rel="noopener noreferrer" className="text-[#E96C38] hover:underline">
                DAWN Rewards System blog post
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Black Box */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(233,108,56,0.1)", border: "1px solid rgba(233,108,56,0.2)" }}>
            <ShoppingBag size={22} className="text-[#E96C38]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">{HARDWARE_FACTS.blackBox.name}</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              {HARDWARE_FACTS.blackBox.description}
            </p>

            <div className="mb-4 p-3 rounded-lg" style={{ background: "rgba(233,108,56,0.08)", border: "1px solid rgba(233,108,56,0.15)" }}>
              <p className="text-xs font-semibold text-[#E96C38] mb-2">Partner Networks (multi-DePIN):</p>
              <div className="flex flex-wrap gap-2">
                {HARDWARE_FACTS.blackBox.partnerNetworks.map((net) => (
                  <span key={net} className="px-2 py-1 rounded text-xs"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                    {net}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 rounded-lg flex items-start gap-2"
              style={{ background: "rgba(255,200,100,0.05)", border: "1px solid rgba(255,200,100,0.1)" }}>
              <AlertCircle size={13} className="text-amber-400/70 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-white/40">
                {DISCLAIMERS.hardwareRewards} Check for any current referral or activation bonus directly on DAWN&apos;s store — do not rely on this community tool for current promotions, which may change.
              </p>
            </div>

            <a href={DAWN_LINKS.blackBoxStore} target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
              <ExternalLink size={15} />
              Buy Black Box (shop.dawninternet.com)
            </a>
          </div>
        </div>
      </motion.div>

      {/* Antenna / Deployer */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(233,108,56,0.1)", border: "1px solid rgba(233,108,56,0.2)" }}>
            <Radio size={22} className="text-[#E96C38]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">{HARDWARE_FACTS.antenna.name}</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              {HARDWARE_FACTS.antenna.description}
            </p>

            <div className="mb-4 p-3 rounded-lg"
              style={{ background: "rgba(233,108,56,0.08)", border: "1px solid rgba(233,108,56,0.15)" }}>
              <p className="text-xs font-semibold text-[#E96C38] mb-2">About the Deployer Application:</p>
              <p className="text-xs text-white/60 leading-relaxed">{HARDWARE_FACTS.antenna.deployerFormNote}</p>
            </div>

            <div className="space-y-2 mb-4">
              {HARDWARE_FACTS.antenna.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                  <AlertCircle size={11} className="text-[#E96C38]/60 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>

            <a href={DAWN_LINKS.deployerForm} target="_blank" rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-2.5">
              <ExternalLink size={15} />
              Apply for Antenna / Deployer Network
            </a>
            <p className="text-[10px] text-white/30 mt-2">
              This is the real, only DAWN Deployer application form (Google Forms).
              We do not build substitute forms or auto-pipe your data.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Community links */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">DAWN Community</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Twitter / X", url: DAWN_LINKS.twitter },
            { label: "Telegram", url: DAWN_LINKS.telegram },
            { label: "Research", url: DAWN_LINKS.research },
            { label: "Whitepaper", url: DAWN_LINKS.whitepaper },
            { label: "Explainer Blog", url: DAWN_LINKS.explainerBlog },
            { label: "DAWN Main Site", url: DAWN_LINKS.mainSite },
          ].map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-white/60 hover:text-[#E96C38] transition-all duration-200 hover:bg-[rgba(233,108,56,0.08)]"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <ExternalLink size={11} />
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
