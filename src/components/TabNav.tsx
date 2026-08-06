"use client";

import { motion } from "framer-motion";
import { Home, Compass, Map, FileText, ExternalLink, Info } from "lucide-react";
import type { TabId } from "@/app/page";

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  inline?: boolean;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: "home", label: "Home", shortLabel: "Home", icon: <Home size={15} /> },
  { id: "check", label: "Check My Fit", shortLabel: "Fit", icon: <Compass size={15} /> },
  { id: "map", label: "Opportunity Map", shortLabel: "Map", icon: <Map size={15} /> },
  { id: "pitch", label: "My Pitch", shortLabel: "Pitch", icon: <FileText size={15} /> },
  { id: "apply", label: "Apply", shortLabel: "Apply", icon: <ExternalLink size={15} /> },
  { id: "about", label: "About", shortLabel: "About", icon: <Info size={15} /> },
];

export default function TabNav({ activeTab, onTabChange, inline }: TabNavProps) {
  const content = (
    <div className="flex items-stretch overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 flex-shrink-0
              ${isActive
                ? "border-[#E96C38] text-[#E96C38]"
                : "border-transparent text-white/50 hover:text-white/80 hover:border-white/20"
              }`}
          >
            <span className={isActive ? "text-[#E96C38]" : "text-white/40"}>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>

            {isActive && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E96C38] rounded-t"
                style={{ boxShadow: "0 0 8px rgba(233,108,56,0.6)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <nav
      className="sticky top-0 z-40 px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(233,108,56,0.1)" }}
    >
      <div className="max-w-6xl mx-auto">{content}</div>
    </nav>
  );
}