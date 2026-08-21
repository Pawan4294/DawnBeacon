/**
 * matchEngine.ts
 * Deterministic rule-based recommendation engine.
 * Returns: "Black Box" | "Antenna" | "recruit a bigger host"
 * with a plain-language reason.
 * No fabricated numbers — purely qualitative rule matching.
 */

import type { HardwareFactorsResult } from "./hardwareFactors";

export type Recommendation = "Black Box" | "Antenna" | "Recruit a Bigger Host";

export interface MatchInput {
  rooftopAccess: boolean;
  propertyType: "home" | "shop" | "school" | "commercial";
  nearbyDensity: "few" | "moderate" | "a lot";
  interest: "myself" | "someone else" | "not sure";
}

export interface MatchResult {
  recommendation: Recommendation;
  confidence: "High" | "Medium" | "Low";
  reason: string;
  secondaryOption?: Recommendation;
  secondaryReason?: string;
  caveats: string[];
}

export function getRecommendation(input: MatchInput, scores?: HardwareFactorsResult): MatchResult {
  const { rooftopAccess, propertyType, nearbyDensity, interest } = input;

  // Rule: If interest is "someone else", guide to recruit path — unaffected by scores
  if (interest === "someone else") {
    return {
      recommendation: "Recruit a Bigger Host",
      confidence: "High",
      reason:
        "Since you're exploring this for someone else, the best path is to identify a property owner or business with suitable premises and bring them the opportunity directly.",
      caveats: [
        "You can still run the DAWN Validator Extension yourself — it requires no hardware",
        "Use the My Pitch tab to generate shareable information for a potential host",
        "The Deployer form is designed for operators with existing or multiple sites",
      ],
    };
  }

  // If we have real computed fit scores, let them decide which hardware wins —
  // this keeps the headline recommendation consistent with the Hardware Fit
  // Analysis numbers shown on screen, instead of a separate rule ladder that
  // could disagree with the scores.
  if (scores) {
    const bb = scores.blackBox.fitScore;
    const ant = scores.antenna.fitScore;

    if (ant > bb) {
      const confidence = ant >= 75 ? "High" : ant >= 50 ? "Medium" : "Low";
      return {
        recommendation: "Antenna",
        confidence,
        reason: scores.antenna.summary,
        secondaryOption: "Black Box",
        secondaryReason: "A Black Box can run alongside or independently if the Antenna application is pending.",
        caveats: [
          "The Deployer form targets operators with existing or multiple sites — individual applicants can apply under 'Other'",
          "Hardware reward amounts are not published as a specific formula by DAWN",
          "Confirmed DAWN markets may affect geographic bonus eligibility",
        ],
      };
    }

    const confidence = bb >= 75 ? "High" : bb >= 50 ? "Medium" : "Low";
    return {
      recommendation: "Black Box",
      confidence,
      reason: scores.blackBox.summary,
      secondaryOption: rooftopAccess ? "Antenna" : undefined,
      secondaryReason: rooftopAccess ? "You have rooftop access — Antenna may also be worth reviewing via the Deployer form." : undefined,
      caveats: [
        "Geographic bonus eligibility depends on DAWN's Medallion zone mapping — no guarantee",
        "Hardware reward amounts are not published as a specific formula",
        "The Validator Extension (free, no hardware) is also available for any user",
      ],
    };
  }

  // Fallback rule ladder — only used if scores aren't available for some reason
  if (!rooftopAccess && nearbyDensity === "a lot") {
    return {
      recommendation: "Black Box",
      confidence: "High",
      reason:
        "Without rooftop access, the Black Box is the right fit — it's a plug-in home WiFi 6E router that participates in DAWN's network without needing elevation. Dense surroundings may help with geographic bonus zone eligibility.",
      caveats: [
        "Black Box requires a stable home internet connection",
        "Geographic bonus eligibility depends on DAWN's Medallion zone mapping — no guarantee",
        "Hardware reward amounts are not published as a specific formula",
      ],
    };
  }

  if (propertyType === "home" || propertyType === "shop") {
    return {
      recommendation: "Black Box",
      confidence: "Medium",
      reason:
        "A home or shop environment without rooftop access is well-suited to the Black Box — it requires no special infrastructure and participates in multiple DePIN networks simultaneously.",
      caveats: [
        "Lower-density areas may have fewer Medallion zone bonus opportunities",
        "The Validator Extension (free, no hardware) is also available for any user",
        "Hardware reward amounts are not published as a specific formula",
      ],
    };
  }

  return {
    recommendation: "Black Box",
    confidence: "Low",
    reason:
      "Based on the information provided, Black Box is the most accessible starting point. Running the free Validator Extension is always a parallel option regardless of hardware.",
    caveats: [
      "Share more specific location details on the Opportunity Map for a better assessment",
      "No hardware reward formula is published — qualitative factors only",
      "This is a community tool recommendation, not official DAWN guidance",
    ],
  };
}