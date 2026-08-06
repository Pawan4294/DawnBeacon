/**
 * hardwareFactors.ts
 * Returns qualitative hardware fit factors — NO invented numeric ranges.
 * All factor names reference real DAWN mechanisms from the whitepaper and site.
 */

import { HARDWARE_FACTS, MEDALLION_SYSTEM } from "@/data/dawnFacts";

export interface HardwareInput {
  rooftopAccess: boolean;
  propertyType: "home" | "shop" | "school" | "commercial";
  nearbyDensity: "few" | "moderate" | "a lot";
  interest: "myself" | "someone else" | "not sure";
}

export interface HardwareFactor {
  name: string;
  description: string;
  applies: boolean;
  source?: string;
}

export interface HardwareFactorsResult {
  blackBox: {
    factors: HardwareFactor[];
    fitScore: number; // 0–100, purely qualitative composite
    fitLabel: "Strong Fit" | "Good Fit" | "Possible Fit" | "Limited Fit";
    summary: string;
  };
  antenna: {
    factors: HardwareFactor[];
    fitScore: number;
    fitLabel: "Strong Fit" | "Good Fit" | "Possible Fit" | "Limited Fit";
    summary: string;
  };
}

function scoreFitLabel(score: number): "Strong Fit" | "Good Fit" | "Possible Fit" | "Limited Fit" {
  if (score >= 75) return "Strong Fit";
  if (score >= 50) return "Good Fit";
  if (score >= 25) return "Possible Fit";
  return "Limited Fit";
}

export function evaluateHardwareFactors(input: HardwareInput): HardwareFactorsResult {
  // ── Black Box factors ──────────────────────────────────────────────────────
  const bbFactors: HardwareFactor[] = [
    {
      name: "Bandwidth Seeding (Proof-of-Bandwidth Validation)",
      description: "Any home or business internet connection can participate in DAWN's bandwidth seeding.",
      applies: true,
      source: HARDWARE_FACTS.blackBox.storeUrl,
    },
    {
      name: "Multi-Network DePIN Participation",
      description: `Simultaneously mines for partner networks: ${HARDWARE_FACTS.blackBox.partnerNetworks.join(", ")}.`,
      applies: true,
      source: HARDWARE_FACTS.blackBox.storeUrl,
    },
    {
      name: "Geographic Focus Bonus (Medallion System)",
      description: `DAWN's Medallion system provides geographic-zone bonuses via H3 hexagon mapping. ${MEDALLION_SYSTEM.note}`,
      applies: input.nearbyDensity === "moderate" || input.nearbyDensity === "a lot",
      source: MEDALLION_SYSTEM.source,
    },
    {
      name: "Activation Bonus at Setup",
      description: "A one-time activation bonus is associated with setting up the Black Box.",
      applies: true,
      source: HARDWARE_FACTS.blackBox.storeUrl,
    },
    {
      name: "Home / Small Office Compatibility",
      description: "Black Box is designed for home and small business environments — no elevated access needed.",
      applies: input.propertyType === "home" || input.propertyType === "shop",
    },
    {
      name: "Urban/Suburban Location Advantage",
      description: "Denser areas have more potential for geographic bonus zones.",
      applies: input.nearbyDensity === "a lot" || input.nearbyDensity === "moderate",
    },
  ];

  const bbApplied = bbFactors.filter((f) => f.applies).length;
  const bbScore = Math.round((bbApplied / bbFactors.length) * 100);

  // ── Antenna factors ────────────────────────────────────────────────────────
  const antFactors: HardwareFactor[] = [
    {
      name: "Elevated Location Access",
      description: "Antenna hardware requires an elevated position (rooftop, tower, or tall commercial building).",
      applies: input.rooftopAccess,
    },
    {
      name: "Clear Line of Sight",
      description: "Dense urban areas with clear sight lines are the primary target for Antenna deployment.",
      applies: input.nearbyDensity === "a lot",
    },
    {
      name: "Geographic Coverage Bonus (Medallion System)",
      description: `Antenna deployments in active Medallion zones may qualify for geographic bonuses. ${MEDALLION_SYSTEM.note}`,
      applies: input.nearbyDensity === "moderate" || input.nearbyDensity === "a lot",
      source: MEDALLION_SYSTEM.source,
    },
    {
      name: "Wireless Network Coverage Provision",
      description: "Antenna hardware contributes to DAWN's wireless coverage layer.",
      applies: input.rooftopAccess && input.nearbyDensity !== "few",
    },
    {
      name: "Commercial / Institutional Property",
      description: "The Deployer form targets operators with existing or multiple commercial/institutional sites.",
      applies: input.propertyType === "commercial" || input.propertyType === "school",
    },
    {
      name: "Bandwidth Seeding at Scale",
      description: "Antenna nodes contribute bandwidth seeding at a larger scale than home devices.",
      applies: input.rooftopAccess && (input.propertyType === "commercial" || input.propertyType === "school"),
    },
  ];

  const antApplied = antFactors.filter((f) => f.applies).length;
  const antScore = Math.round((antApplied / antFactors.length) * 100);

  return {
    blackBox: {
      factors: bbFactors,
      fitScore: bbScore,
      fitLabel: scoreFitLabel(bbScore),
      summary:
        bbScore >= 75
          ? "Your situation aligns well with Black Box deployment. Plug-and-play setup, no rooftop needed."
          : bbScore >= 50
          ? "Black Box is a reasonable fit — some factors apply but location density may limit bonus potential."
          : "Black Box may still work, but fewer geographic bonus factors apply to your situation.",
    },
    antenna: {
      factors: antFactors,
      fitScore: antScore,
      fitLabel: scoreFitLabel(antScore),
      summary:
        antScore >= 75
          ? "Your situation strongly matches Antenna deployment criteria — elevated access in a dense area."
          : antScore >= 50
          ? "Some Antenna factors apply. Consider whether you have true elevated, clear line-of-sight access."
          : antScore >= 25
          ? "Limited Antenna fit factors apply. The Deployer form is worth reviewing, but manage expectations."
          : "Antenna deployment may not match your current situation — rooftop access and dense urban area are key requirements.",
    },
  };
}
