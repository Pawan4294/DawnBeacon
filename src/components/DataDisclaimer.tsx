"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface DataDisclaimerProps {
  message: string;
  className?: string;
}

export default function DataDisclaimer({ message, className = "" }: DataDisclaimerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-xl ${className}`}
      style={{
        background: "rgba(233,108,56,0.08)",
        border: "1px solid rgba(233,108,56,0.2)",
      }}
    >
      <AlertCircle size={16} className="text-[#E96C38] flex-shrink-0 mt-0.5" />
      <p className="text-xs text-white/60 leading-relaxed">{message}</p>
    </motion.div>
  );
}
