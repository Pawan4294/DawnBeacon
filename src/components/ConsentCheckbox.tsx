"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ConsentCheckbox({ checked, onChange }: ConsentCheckboxProps) {
  return (
    <motion.label
      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer group"
      style={{
        background: checked ? "rgba(233,108,56,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${checked ? "rgba(233,108,56,0.35)" : "rgba(255,255,255,0.08)"}`,
        transition: "all 0.2s ease",
      }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4"
        />
      </div>
      <div className="flex items-start gap-2">
        <Shield size={14} className="text-[#E96C38] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/60 leading-relaxed">
          I agree to be contacted about DAWN hosting opportunities and rewards. My details are collected by this
          independent community tool, not DAWN directly.{" "}
          <span className="text-white/40">
            (You can request deletion anytime. No phone number is collected. See Privacy Policy.)
          </span>
        </p>
      </div>
    </motion.label>
  );
}
