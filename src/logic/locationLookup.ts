/**
 * locationLookup.ts
 * Shared real-data location helpers — used by both Check My Fit and
 * Opportunity Map so there's one source of truth, not two copies.
 * Nominatim (free geocoding) + Overpass (free OSM data). No fabricated data:
 * if a query fails or returns nothing, callers get null and must show that
 * honestly rather than guessing.
 */

const NOMINATIM_DELAY_MS = 1100; // respect Nominatim's 1 req/sec usage policy
let lastNominatimCall = 0;

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    county?: string;
  };
}

export interface OverpassData {
  buildingCount: number;
  nearbyPOIs: string[];
  hasUrbanFeatures: boolean;
  raw: boolean;
}

export async function nominatimSearch(query: string): Promise<NominatimResult[]> {
  const now = Date.now();
  const wait = Math.max(0, NOMINATIM_DELAY_MS - (now - lastNominatimCall));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimCall = Date.now();

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "DawnBeacon/1.0 (independent community tool; contact: community@dawnbeacon.info)",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) throw new Error("Nominatim search failed");
  return res.json();
}

export async function reverseGeocode(lat: number, lng: number): Promise<NominatimResult | null> {
  const now = Date.now();
  const wait = Math.max(0, NOMINATIM_DELAY_MS - (now - lastNominatimCall));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimCall = Date.now();

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "DawnBeacon/1.0 (independent community tool; contact: community@dawnbeacon.info)" },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function queryOverpass(lat: number, lng: number): Promise<OverpassData | null> {
  const overpassQuery = `
    [out:json][timeout:15];
    (
      way(around:500,${lat},${lng})["building"];
      node(around:500,${lat},${lng})["amenity"];
      node(around:500,${lat},${lng})["shop"];
    );
    out count;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });
    if (!res.ok) return null;
    const data = await res.json();

    const totalCount = data?.elements?.length || 0;
    if (totalCount === 0) return null;

    return {
      buildingCount: totalCount,
      nearbyPOIs: [],
      hasUrbanFeatures: totalCount > 10,
      raw: true,
    };
  } catch {
    return null;
  }
}

export function inferDensity(overpass: OverpassData | null): "few" | "moderate" | "a lot" {
  if (!overpass) return "few";
  if (overpass.buildingCount > 30) return "a lot";
  if (overpass.buildingCount > 10) return "moderate";
  return "few";
}