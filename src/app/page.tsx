"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Footer from "@/components/Footer";
import HomeTab from "@/tabs/Home";
import CheckMyFitTab from "@/tabs/CheckMyFit";
import OpportunityMapTab from "@/tabs/OpportunityMap";
import MyPitchTab from "@/tabs/MyPitch";
import ApplyTab from "@/tabs/Apply";
import AboutTab from "@/tabs/About";
import ParticleBackground from "@/components/ParticleBackground";
import type { FitResult } from "@/types/fitResult";

export type TabId = "home" | "check" | "map" | "pitch" | "apply" | "about";

export default function DawnBeaconApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [fitResult, setFitResult] = useState<FitResult | null>(null);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab onTabChange={handleTabChange} />;
      case "check":
        return <CheckMyFitTab onTabChange={handleTabChange} onResult={setFitResult} />;
      case "map":
        return <OpportunityMapTab onTabChange={handleTabChange} onResult={setFitResult} />;
      case "pitch":
        return <MyPitchTab fitResult={fitResult} onTabChange={handleTabChange} />;
      case "apply":
        return <ApplyTab />;
      case "about":
        return <AboutTab />;
      default:
        return <HomeTab onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <ParticleBackground />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Orange orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 orb opacity-40" style={{ animationDelay: "0s" }} />
      <div className="fixed bottom-1/4 -right-32 w-80 h-80 orb opacity-30" style={{ animationDelay: "3s" }} />
      <div className="fixed top-2/3 left-1/2 w-64 h-64 orb opacity-20" style={{ animationDelay: "6s" }} />

      {/* Main layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
