"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, ChevronRight, CheckCircle, XCircle, AlertCircle,
  Users, Clock, Share2, Calculator, Zap
} from "lucide-react";
import { getRecommendation } from "@/logic/matchEngine";
import { evaluateHardwareFactors } from "@/logic/hardwareFactors";
import { calculateExtensionRewards } from "@/logic/extensionCalculator";
import { nominatimSearch, queryOverpass, inferDensity } from "@/logic/locationLookup";
import type { NominatimResult, OverpassData } from "@/logic/locationLookup";
import { EXTENSION_REWARDS, DAWN_LINKS, DISCLAIMERS, HARDWARE_FACTS } from "@/data/dawnFacts";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import DataDisclaimer from "@/components/DataDisclaimer";
import type { FitResult } from "@/types/fitResult";
import type { TabId } from "@/app/page";

interface CheckMyFitProps {
  onTabChange: (tab: TabId) => void;
  onResult: (result: FitResult | null) => void;
}

type PropertyType = "home" | "shop" | "school" | "commercial";
type Density = "few" | "moderate" | "a lot";
type Interest = "myself" | "someone else" | "not sure";

export default function CheckMyFitTab({ onTabChange, onResult }: CheckMyFitProps) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rooftopAccess, setRooftopAccess] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>("home");
  const [nearbyDensity, setNearbyDensity] = useState<Density>("moderate");
  const [interest, setInterest] = useState<Interest>("myself");
  const [consent, setConsent] = useState(false);

  // Location search state — real address, real Overpass density, no fabricated data
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<NominatimResult[]>([]);
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationPin, setLocationPin] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [locationOverpass, setLocationOverpass] = useState<OverpassData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) return;
    setLocationSearching(true);
    try {
      const results = await nominatimSearch(locationQuery);
      setLocationResults(results);
    } catch {
      setLocationResults([]);
    }
    setLocationSearching(false);
  };

  const handleSelectLocation = async (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setLocationPin({ name: r.display_name, lat, lng });
    setLocationResults([]);
    setLocationQuery("");
    setLocationLoading(true);
    const overpass = await queryOverpass(lat, lng);
    setLocationOverpass(overpass);
    if (overpass) {
      setNearbyDensity(inferDensity(overpass));
    }
    setLocationLoading(false);
  };


  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [result, setResult] = useState<FitResult | null>(null);
  const [submitError, setSubmitError] = useState("");

  // Calculator state
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [referralsA, setReferralsA] = useState(3);
  const [referralsB, setReferralsB] = useState(5);
  const [referralsC, setReferralsC] = useState(8);
  const [socialsFollowed, setSocialsFollowed] = useState(3);

  const calcResult = calculateExtensionRewards({
    hoursConnectedPerDay: hoursPerDay,
    referralsTierA: referralsA,
    referralsTierB: referralsB,
    referralsTierC: referralsC,
    socialsFollowed,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setSubmitError("");

    const hardwareFactors = evaluateHardwareFactors({ rooftopAccess, propertyType, nearbyDensity, interest });
    const matchResult = getRecommendation({ rooftopAccess, propertyType, nearbyDensity, interest }, hardwareFactors);

    const fitResult: FitResult = {
      name, email, propertyType, rooftopAccess, nearbyDensity, interest,
      matchResult, hardwareFactors,
      source: "form",
      timestamp: Date.now(),
    };

    try {
      await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, propertyType, rooftopAccess, nearbyDensity, interest, recommendation: matchResult.recommendation, consent }),
      });
    } catch {
      // Email sending is best-effort — don't block on it
    }

    setResult(fitResult);
    onResult(fitResult);
    setSubmitted(true);
    setSubmitting(false);
  };

  const confidenceColor = (c: string) => {
    if (c === "High") return "#E96C38";
    if (c === "Medium") return "#f0a060";
    return "#a0a0a0";
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(233,108,56,0.15)", border: "1px solid rgba(233,108,56,0.3)", color: "#E96C38" }}>
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Check My Fit</h2>
            <p className="text-sm text-white/50">Get a personalized DAWN hardware recommendation</p>
          </div>
        </div>
        <DataDisclaimer message={DISCLAIMERS.hardwareRewards} />
      </motion.div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Name & Email */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Your Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Name *</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Property Details</h3>

              <div>
                <label className="block text-xs text-white/50 mb-2">Do you have rooftop or elevated access? *</label>
                <div className="flex gap-3">
                  {[true, false].map((val) => (
                    <button key={String(val)} type="button"
                      onClick={() => setRooftopAccess(val)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${rooftopAccess === val
                        ? "text-white"
                        : "text-white/40 hover:text-white/60"}`}
                      style={{
                        background: rooftopAccess === val ? "rgba(233,108,56,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${rooftopAccess === val ? "rgba(233,108,56,0.5)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      {val ? "✓ Yes" : "✗ No"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">Property type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["home", "shop", "school", "commercial"] as PropertyType[]).map((pt) => (
                    <button key={pt} type="button"
                      onClick={() => setPropertyType(pt)}
                      className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${propertyType === pt ? "text-white" : "text-white/40 hover:text-white/60"}`}
                      style={{
                        background: propertyType === pt ? "rgba(233,108,56,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${propertyType === pt ? "rgba(233,108,56,0.5)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      {pt === "commercial" ? "Commercial" : pt.charAt(0).toUpperCase() + pt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">Your address (optional but recommended) *</label>
                <p className="text-[11px] text-white/35 mb-2">Search your real address so nearby density is measured from live map data, not guessed. You can skip this and set density manually below instead.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleLocationSearch())}
                    placeholder="Search any address, city, or landmark..."
                    className="flex-1 px-4 py-3 rounded-xl text-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-white placeholder-white/30 focus:outline-none focus:border-[rgba(233,108,56,0.5)]"
                  />
                  <button type="button" onClick={handleLocationSearch} disabled={locationSearching}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-[#E96C38]"
                    style={{ background: "rgba(233,108,56,0.12)", border: "1px solid rgba(233,108,56,0.3)" }}>
                    {locationSearching ? "..." : "Search"}
                  </button>
                </div>

                {locationResults.length > 0 && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                    {locationResults.map((r, i) => (
                      <button key={i} type="button" onClick={() => handleSelectLocation(r)}
                        className="w-full text-left px-4 py-2.5 text-xs text-white/70 hover:bg-[rgba(233,108,56,0.1)] border-b border-[rgba(255,255,255,0.05)] last:border-0">
                        {r.display_name}
                      </button>
                    ))}
                  </div>
                )}

                {locationPin && (
                  <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: "rgba(233,108,56,0.08)", border: "1px solid rgba(233,108,56,0.2)" }}>
                    {locationLoading ? (
                      <span className="text-white/50">Checking real map data for this location...</span>
                    ) : locationOverpass ? (
                      <span className="text-[#E96C38]">
                        ✓ Location set: {locationPin.name}. Nearby density auto-detected as <strong>{nearbyDensity}</strong> from live OpenStreetMap data ({locationOverpass.buildingCount} features within 500m).
                      </span>
                    ) : (
                      <span className="text-white/50">
                        Location set: {locationPin.name}. Limited map data available here — density left as manual selection below.
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">
                  People/density nearby * {locationOverpass && <span className="text-[#E96C38]">(auto-detected — adjust if needed)</span>}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([["few", "Sparse 🏕"], ["moderate", "Moderate 🏘"], ["a lot", "Dense 🏙"]] as [Density, string][]).map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => setNearbyDensity(val)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${nearbyDensity === val ? "text-white" : "text-white/40 hover:text-white/60"}`}
                      style={{
                        background: nearbyDensity === val ? "rgba(233,108,56,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${nearbyDensity === val ? "rgba(233,108,56,0.5)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">Who is this for? *</label>
                <div className="grid grid-cols-3 gap-2">
                  {([["myself", "Myself"], ["someone else", "Someone Else"], ["not sure", "Not Sure"]] as [Interest, string][]).map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => setInterest(val)}
                      className={`py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${interest === val ? "text-white" : "text-white/40 hover:text-white/60"}`}
                      style={{
                        background: interest === val ? "rgba(233,108,56,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${interest === val ? "rgba(233,108,56,0.5)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Consent */}
            <ConsentCheckbox checked={consent} onChange={setConsent} />

            {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

            <motion.button
              type="submit"
              disabled={!consent || submitting}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              whileHover={consent && !submitting ? { scale: 1.01 } : {}}
              whileTap={consent && !submitting ? { scale: 0.99 } : {}}
            >
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Compass size={18} />
                  Get My Recommendation
                  <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </motion.form>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Recommendation */}
            <div className="glass-card p-6 border border-[rgba(233,108,56,0.3)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Your Recommendation</p>
                  <h3 className="text-3xl font-bold text-gradient" style={{ fontFamily: "Space Grotesk" }}>
                    {result.matchResult.recommendation}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${confidenceColor(result.matchResult.confidence)}20`, color: confidenceColor(result.matchResult.confidence), border: `1px solid ${confidenceColor(result.matchResult.confidence)}40` }}>
                  {result.matchResult.confidence} confidence
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{result.matchResult.reason}</p>

              {result.matchResult.caveats.length > 0 && (
                <div className="mt-4 space-y-2">
                  {result.matchResult.caveats.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                      <AlertCircle size={12} className="text-[#E96C38] mt-0.5 flex-shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.matchResult.secondaryOption && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-xs text-white/40 mb-1">Also consider:</p>
                  <p className="text-sm font-semibold text-white">{result.matchResult.secondaryOption}</p>
                  <p className="text-xs text-white/50 mt-1">{result.matchResult.secondaryReason}</p>
                </div>
              )}
            </div>

            {/* Extension Rewards Calculator Toggle */}
            <motion.button
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full flex items-center justify-between p-4 glass-card glass-card-hover"
              whileHover={{ scale: 1.005 }}
            >
              <div className="flex items-center gap-3">
                <Calculator size={18} className="text-[#E96C38]" />
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">See Extension Rewards Estimate</p>
                  <p className="text-xs text-white/40">Validator Extension — no hardware required</p>
                </div>
              </div>
              <motion.div animate={{ rotate: showCalculator ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={16} className="text-[#E96C38] rotate-90" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {/* Calculator section */}
                  <div className="glass-card p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-[#E96C38]" />
                      <h4 className="font-bold text-white text-sm">Extension Rewards Estimate (for Validator Extension users only)</h4>
                    </div>

                    <DataDisclaimer message={`All formulas use only real published numbers from DAWN's Rewards System blog post (${DAWN_LINKS.rewardsSystem}). Referral bonus assumes your referrals each earn the same daily points as you — a symmetric, conservative assumption.`} />

                    {/* Sliders */}
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="flex items-center gap-1"><Clock size={11} /> Hours connected/day</span>
                          <span className="text-[#E96C38] font-bold number-display">{hoursPerDay}h</span>
                        </div>
                        <input type="range" min={0} max={24} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))}
                          style={{ background: `linear-gradient(to right, #E96C38 ${(hoursPerDay / 24) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                        <div className="flex justify-between text-[10px] text-white/25 mt-1"><span>0h</span><span>24h</span></div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="flex items-center gap-1"><Users size={11} /> Tier A referrals (direct — 20% of their points)</span>
                          <span className="text-[#E96C38] font-bold number-display">{referralsA}</span>
                        </div>
                        <input type="range" min={0} max={50} value={referralsA} onChange={e => setReferralsA(Number(e.target.value))}
                          style={{ background: `linear-gradient(to right, #E96C38 ${(referralsA / 50) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="flex items-center gap-1"><Users size={11} /> Tier B referrals (their referrals — 10%)</span>
                          <span className="text-[#E96C38] font-bold number-display">{referralsB}</span>
                        </div>
                        <input type="range" min={0} max={100} value={referralsB} onChange={e => setReferralsB(Number(e.target.value))}
                          style={{ background: `linear-gradient(to right, #E96C38 ${(referralsB / 100) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="flex items-center gap-1"><Users size={11} /> Tier C referrals (third level — 5%)</span>
                          <span className="text-[#E96C38] font-bold number-display">{referralsC}</span>
                        </div>
                        <input type="range" min={0} max={200} value={referralsC} onChange={e => setReferralsC(Number(e.target.value))}
                          style={{ background: `linear-gradient(to right, #E96C38 ${(referralsC / 200) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                          <span className="flex items-center gap-1"><Share2 size={11} /> Socials followed ({EXTENSION_REWARDS.pointsPerSocialPlatform.toLocaleString()} pts each — one-time)</span>
                          <span className="text-[#E96C38] font-bold number-display">{socialsFollowed}/3</span>
                        </div>
                        <input type="range" min={0} max={3} value={socialsFollowed} onChange={e => setSocialsFollowed(Number(e.target.value))}
                          style={{ background: `linear-gradient(to right, #E96C38 ${(socialsFollowed / 3) * 100}%, rgba(255,255,255,0.1) 0%)` }} />
                        <div className="flex justify-between text-[10px] text-white/25 mt-1"><span>0</span><span>X, Discord, Telegram</span></div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Daily connection pts", value: calcResult.breakdown.connectionPoints.toLocaleString(), sub: `${hoursPerDay}h × ${EXTENSION_REWARDS.pointsPerHour} pts/hr` },
                        { label: "Daily referral bonus", value: calcResult.dailyReferralBonusPoints.toLocaleString(), sub: "A+B+C tiers combined" },
                        { label: "One-time social pts", value: calcResult.oneTimeSocialPoints.toLocaleString(), sub: `${socialsFollowed} of 3 platforms` },
                        { label: "Total daily pts", value: calcResult.totalDailyPoints.toLocaleString(), sub: "connection + referrals" },
                        { label: "30-day estimate", value: calcResult.thirtyDayEstimate.toLocaleString(), sub: "incl. one-time socials" },
                        { label: "90-day estimate", value: calcResult.ninetyDayEstimate.toLocaleString(), sub: "incl. one-time socials" },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          className="rounded-xl p-3 text-center"
                          style={{ background: "rgba(233,108,56,0.08)", border: "1px solid rgba(233,108,56,0.15)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="text-xl font-bold text-[#E96C38] number-display">{stat.value}</div>
                          <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                          <div className="text-[10px] text-white/30 mt-0.5">{stat.sub}</div>
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-[10px] text-white/30 text-center leading-relaxed">
                      These estimates use ONLY the real formula from{" "}
                      <a href={DAWN_LINKS.rewardsSystem} target="_blank" rel="noopener noreferrer" className="text-[#E96C38] hover:underline">
                        DAWN&apos;s published Rewards System
                      </a>
                      . Referral bonus assumes symmetric activity. Points do not have a confirmed dollar value.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hardware Factors */}
            <div className="space-y-4">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-[#E96C38]" /> Hardware Fit Analysis
              </h4>

              {[
                { hw: result.hardwareFactors.blackBox, product: HARDWARE_FACTS.blackBox, storeUrl: DAWN_LINKS.blackBoxStore, applyUrl: null },
                { hw: result.hardwareFactors.antenna, product: HARDWARE_FACTS.antenna, storeUrl: null, applyUrl: DAWN_LINKS.deployerForm },
              ].map(({ hw, product, storeUrl, applyUrl }, idx) => (
                <div key={idx} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-white">{product.name}</h5>
                      <p className="text-xs text-white/50">{product.tagline}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold number-display"
                        style={{ color: hw.fitScore >= 50 ? "#E96C38" : "rgba(255,255,255,0.4)" }}>
                        {hw.fitScore}%
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: hw.fitScore >= 75 ? "rgba(233,108,56,0.2)" : hw.fitScore >= 50 ? "rgba(233,108,56,0.1)" : "rgba(255,255,255,0.05)",
                          color: hw.fitScore >= 50 ? "#E96C38" : "rgba(255,255,255,0.4)",
                          border: `1px solid ${hw.fitScore >= 50 ? "rgba(233,108,56,0.3)" : "rgba(255,255,255,0.1)"}`,
                        }}>
                        {hw.fitLabel}
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar mb-3">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${hw.fitScore}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>

                  <p className="text-xs text-white/60 mb-3">{hw.summary}</p>

                  <div className="space-y-1.5">
                    {hw.factors.map((factor, fi) => (
                      <div key={fi} className={`factor-check ${factor.applies ? "factor-applies" : "factor-not-applies"}`}>
                        {factor.applies
                          ? <CheckCircle size={12} className="flex-shrink-0" />
                          : <XCircle size={12} className="flex-shrink-0" />}
                        <span className="text-xs">{factor.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {storeUrl && (
                      <a href={storeUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-primary text-xs px-4 py-2 flex items-center gap-1">
                        Buy Black Box →
                      </a>
                    )}
                    {applyUrl && (
                      <a href={applyUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-xs px-4 py-2 flex items-center gap-1">
                        Apply for Antenna →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => onTabChange("pitch")}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                Generate My Pitch →
              </motion.button>
              <motion.button
                onClick={() => { setSubmitted(false); setResult(null); setShowCalculator(false); onResult(null); }}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                Start Over
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}