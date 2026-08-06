/**
 * matchEngine.ts
 * Deterministic rule-based recommendation engine.
 * Returns: "Black Box" | "Antenna" | "recruit a bigger host"
 * with a plain-language reason.
 * No fabricated numbers — purely qualitative rule matching.
 */

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

export function getRecommendation(input: MatchInput): MatchResult {
  const { rooftopAccess, propertyType, nearbyDensity, interest } = input;

  // Rule: If interest is "someone else", guide to recruit path
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

  // Rule: Strong Antenna candidate
  if (rooftopAccess && nearbyDensity === "a lot" && (propertyType === "commercial" || propertyType === "school")) {
    return {
      recommendation: "Antenna",
      confidence: "High",
      reason:
        "You have rooftop access, a dense nearby population, and a commercial or institutional property — this closely matches the Deployer program's target profile for Antenna deployment.",
      secondaryOption: "Black Box",
      secondaryReason: "A Black Box can run alongside or independently if the Antenna application is pending.",
      caveats: [
        "The Deployer form targets operators with existing or multiple sites — individual applicants can apply under 'Other'",
        "Hardware reward amounts are not published as a specific formula by DAWN",
        "Confirmed DAWN markets may affect geographic bonus eligibility",
      ],
    };
  }

  // Rule: Moderate Antenna candidate
  if (rooftopAccess && nearbyDensity !== "few") {
    return {
      recommendation: "Antenna",
      confidence: "Medium",
      reason:
        "You have rooftop access and moderate nearby density, which are two of the main requirements for Antenna placement. The Deployer form is worth reviewing.",
      secondaryOption: "Black Box",
      secondaryReason: "Black Box is a simpler entry point that doesn't require rooftop access approval.",
      caveats: [
        "Line-of-sight quality matters — a clear, unobstructed view of the surrounding area is important",
        "The Deployer form is designed for applicants with existing or multiple locations",
        "No hardware reward formula is published — qualitative factors only",
      ],
    };
  }

  // Rule: Black Box — dense urban, no rooftop
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

  // Rule: Black Box — home/shop, any density
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

  // Rule: Low density, no rooftop — still Black Box but with caveat
  if (nearbyDensity === "few") {
    return {
      recommendation: "Black Box",
      confidence: "Low",
      reason:
        "Low nearby density reduces geographic bonus potential, but the Black Box can still participate in bandwidth seeding and multi-network DePIN. The Validator Extension (free) is also worth running.",
      caveats: [
        "Sparse areas may have limited Medallion zone bonus eligibility",
        "Consider whether a nearby urban site (shop, school) might be a better host",
        "No hardware reward formula is published — qualitative factors only",
      ],
    };
  }

  // Default / not sure
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
