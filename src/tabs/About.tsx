"use client";

import { motion } from "framer-motion";
import { Info, ExternalLink, Shield, FileText, AlertTriangle } from "lucide-react";
import { DAWN_LINKS, DISCLAIMERS } from "@/data/dawnFacts";

export default function AboutTab() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)", color: "#E96C38" }}>
            <Info size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>About DawnBeacon</h2>
            <p className="text-sm text-white/50">What this tool is and isn&apos;t</p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer — prominent */}
      <motion.div
        className="p-5 rounded-2xl"
        style={{ background: "rgba(233,108,56,0.08)", border: "1px solid rgba(233,108,56,0.25)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-[#E96C38] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-[#E96C38] mb-2">Not an official DAWN product</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {DISCLAIMERS.general}
            </p>
            <p className="text-sm text-white/60 leading-relaxed mt-2">
              {DISCLAIMERS.dataAccuracy}
            </p>
          </div>
        </div>
      </motion.div>

      {/* What DawnBeacon does */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="font-bold text-white mb-3">What DawnBeacon Does</h3>
        <div className="space-y-3 text-sm text-white/60 leading-relaxed">
          <p>DawnBeacon is an independent community tool that helps people:</p>
          <ul className="space-y-2 list-none">
            {[
              "Understand DAWN's real Validator Extension reward mechanics (free, no hardware)",
              "Get a rule-based recommendation on whether Black Box or Antenna hardware fits their situation",
              "Search any real-world location and see honest, factor-based fit information from live OpenStreetMap data",
              "Generate a shareable pitch document to bring to potential hosts",
              "Reach DAWN's real store and Deployer application form",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#E96C38] mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* What we don't do */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-white mb-3">What We Don&apos;t Do</h3>
        <div className="space-y-2">
          {[
            "We do not fabricate, simulate, or invent any data, numbers, or reward figures",
            "We do not use DAWN's logo or brand imagery",
            "We do not collect phone numbers",
            "We do not auto-pipe collected leads to any DAWN system",
            "We do not store map searches — the Opportunity Map is live and ephemeral",
            "We do not invent hardware reward dollar amounts or point ranges",
            "We do not pre-bake location data — every map result is a live API call",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/50">
              <span className="text-red-400/60 mt-0.5 flex-shrink-0">✗</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Policy */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-[#E96C38]" />
          <h3 className="font-bold text-white">Privacy Policy</h3>
        </div>
        <div className="space-y-3 text-sm text-white/60 leading-relaxed">
          <p>
            DawnBeacon collects your name and email only if you submit the Check My Fit form.
            We use this only to send you your result and, only with your separate consent,
            to share your contact as a qualified lead with DAWN&apos;s community team. We don&apos;t
            sell or share your data with anyone else. You can request deletion anytime by
            emailing the community maintainer.
          </p>
          <p>
            The Opportunity Map does not store any searches — it looks up public map data live
            and forgets it once you close the tab.
          </p>
          <p>
            No phone number field exists anywhere in this application.
          </p>
          <div className="mt-3 p-3 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white/40">
              <strong className="text-white/60">Data stored:</strong> Name, email, property type, rooftop access, nearby density, interest, recommendation, consent timestamp. Nothing else.
            </p>
            <p className="text-white/40 mt-1">
              <strong className="text-white/60">Retention:</strong> Stored until deletion is requested.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sources */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-[#E96C38]" />
          <h3 className="font-bold text-white">All Sources Used</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: "DAWN Main Site", url: DAWN_LINKS.mainSite, note: "Primary product information" },
            {
              label: "DAWN Validator Extension Rewards System",
              url: DAWN_LINKS.rewardsSystem,
              note: "Source for ALL extension reward numbers shown in this app",
            },
            { label: "DAWN Whitepaper (July 25, 2024)", url: DAWN_LINKS.whitepaper, note: "Medallion system, H3 hexagon mapping, architecture" },
            { label: "DAWN Validator Extension Intro", url: DAWN_LINKS.validatorExtensionIntro, note: "Extension overview" },
            { label: "DAWN Explainer Blog", url: DAWN_LINKS.explainerBlog, note: "Network overview" },
            { label: "DAWN Research", url: DAWN_LINKS.research, note: "Technical research" },
            { label: "DAWN Black Box Store", url: DAWN_LINKS.blackBoxStore, note: "Product information" },
            { label: "DAWN Deployer Interest Form", url: DAWN_LINKS.deployerForm, note: "Official application — Google Forms" },
            { label: "DAWN Twitter / X", url: DAWN_LINKS.twitter, note: "Community updates" },
            { label: "DAWN Telegram", url: DAWN_LINKS.telegram, note: "Community" },
          ].map((source, i) => (
            <div key={i} className="flex items-start gap-2">
              <a href={source.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#E96C38] hover:text-white transition-colors min-w-0 flex-shrink-0">
                <ExternalLink size={11} />
                {source.label}
              </a>
              <span className="text-[11px] text-white/30">— {source.note}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech stack */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="font-bold text-white mb-3">Technology</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
          {[
            "Next.js (App Router) — Frontend framework",
            "Leaflet + OpenStreetMap — Map rendering",
            "Nominatim — Address geocoding (max 1 req/s)",
            "Overpass API — Real building/density data",
            "Drizzle ORM + PostgreSQL — Lead storage",
            "Framer Motion — Animations",
            "jsPDF — Client-side PDF generation",
            "Nodemailer — Confirmation emails",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-[#E96C38] flex-shrink-0">·</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        className="text-center text-xs text-white/25 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Built by the community, for the community. DawnBeacon v1.0
      </motion.p>
    </div>
  );
}
