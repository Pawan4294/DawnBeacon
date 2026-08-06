import type { MatchResult } from "@/logic/matchEngine";
import type { HardwareFactorsResult } from "@/logic/hardwareFactors";

export interface FitResult {
  name?: string;
  email?: string;
  propertyType: string;
  rooftopAccess: boolean;
  nearbyDensity: string;
  interest: string;
  matchResult: MatchResult;
  hardwareFactors: HardwareFactorsResult;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  regionStatus?: "confirmed" | "unconfirmed" | "unknown";
  regionMessage?: string;
  source: "form" | "map";
  timestamp: number;
}
