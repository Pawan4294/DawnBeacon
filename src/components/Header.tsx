"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Radio } from "lucide-react";
import TabNav from "@/components/TabNav";
import type { TabId } from "@/app/page";

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="relative z-50">
      {/* Disclaimer bar — always visible on every tab */}
      <motion.div
        className="disclaimer-bar px-4 py-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-orange-300/80">
          <AlertTriangle size={12} className="text-[#E96C38] flex-shrink-0" />
          <span>
            <span className="font-semibold text-[#E96C38]">DawnBeacon</span>
            {" "}— unofficial community tool, not affiliated with DAWN Internet.
          </span>
          <AlertTriangle size={12} className="text-[#E96C38] flex-shrink-0" />
        </div>
      </motion.div>

      {/* Main header */}
      <div className="px-4 py-4 border-b border-[rgba(233,108,56,0.1)]"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
  <motion.div
    className="flex items-center gap-3 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Logo mark */}
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #E96C38, #c4541d)",
                  boxShadow: "0 0 20px rgba(233,108,56,0.4)",
                }}
                animate={{ boxShadow: ["0 0 20px rgba(233,108,56,0.4)", "0 0 35px rgba(233,108,56,0.7)", "0 0 20px rgba(233,108,56,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Radio size={20} color="white" />
              </motion.div>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <span className="text-gradient">Dawn</span>
                <span className="text-white">Beacon</span>
              </h1>
              <p className="text-[10px] text-white/40 -mt-0.5">Community DAWN Explorer</p>
            </div>
          </motion.div>

          <div className="hidden lg:block flex-shrink-0 mx-6">
  <TabNav activeTab={activeTab} onTabChange={onTabChange} inline />
</div>

          <motion.div
            className="hidden sm:flex items-center gap-2 text-xs text-white/40 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="pulse-orange inline-block w-1.5 h-1.5 rounded-full bg-[#E96C38]" />
            <span>Live data from DAWN&apos;s published sources</span>
          </motion.div>
        </div>

        {/* Tabs on their own row for smaller screens where the middle row is hidden */}
        <div className="lg:hidden mt-3 max-w-6xl mx-auto">
          <TabNav activeTab={activeTab} onTabChange={onTabChange} inline />
        </div>
      </div>
    </header>
  );
}