/**
 * regionCheck.ts
 * Checks whether a geocoded location falls within DAWN's confirmed live markets.
 * CONFIRMED_MARKETS in dawnFacts.ts is the single editable source.
 * Returns a status and honest message — never fabricates presence data.
 */

import { CONFIRMED_MARKETS } from "@/data/dawnFacts";

export interface RegionCheckResult {
  isConfirmedMarket: boolean;
  matchedMarket?: (typeof CONFIRMED_MARKETS)[number];
  status: "confirmed" | "unconfirmed" | "unknown";
  message: string;
}

/**
 * Checks a country name against DAWN's confirmed markets list.
 * @param country - Country name from Nominatim geocoding result
 * @param region  - Optional region/city name for sub-country matching
 */
export function checkRegion(country: string, region?: string): RegionCheckResult {
  if (!country) {
    return {
      isConfirmedMarket: false,
      status: "unknown",
      message:
        "Could not determine the country for this location. DAWN market status is unknown.",
    };
  }

  const normalizedCountry = country.trim().toLowerCase();
  const normalizedRegion = region?.trim().toLowerCase();

  const match = CONFIRMED_MARKETS.find((market) => {
    const countryMatch = market.country.toLowerCase() === normalizedCountry;
    if (!countryMatch) return false;
    // If market has a specific region, check region too
    if (market.region && normalizedRegion) {
      return market.region.toLowerCase() === normalizedRegion;
    }
    return true;
  });

  if (match) {
    return {
      isConfirmedMarket: true,
      matchedMarket: match,
      status: "confirmed",
      message: `${match.country}${match.region ? ` (${match.region})` : ""} is a confirmed DAWN market. ${match.detail}`,
    };
  }

  return {
    isConfirmedMarket: false,
    status: "unconfirmed",
    message:
      `DAWN does not currently have confirmed operations in ${country} — this is informational, not a live opportunity. ` +
      `DAWN's confirmed markets as of this build: ${CONFIRMED_MARKETS.map((m) => m.country + (m.region ? ` (${m.region})` : "")).join(", ")}.`,
  };
}
