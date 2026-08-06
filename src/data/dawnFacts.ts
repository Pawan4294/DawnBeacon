/**
 * dawnFacts.ts — Single source of truth for all real DAWN facts, links, and numbers.
 * All numbers here trace to official DAWN published sources.
 * Update confirmedMarkets[] as DAWN's real footprint changes.
 */

// ─── Real links (official DAWN sources only) ─────────────────────────────────
export const DAWN_LINKS = {
  mainSite: "https://www.dawninternet.com/",
  twitter: "https://twitter.com/dawninternet",
  telegram: "https://t.me/+KbNPWHXb2n5iNTIx",
  validatorExtension:
    "https://chromewebstore.google.com/detail/dawn-validator-chrome-ext/fpdkjdnhkakefebpekbdhillbhonfjjp",
  research: "https://www.dawninternet.com/research",
  whitepaper:
    "https://cdn.prod.website-files.com/665dc8eb8d9f8c4764608070/66b2a5e86d40b4fd716cc51b_DAWN%20Whitepaper%20July%2025%2C%202024.pdf",
  explainerBlog:
    "https://www.dawninternet.com/blog-posts/a-new-dawn-for-the-internet",
  validatorExtensionIntro:
    "https://www.dawninternet.com/blog-posts/introducing-the-dawn-validator-extension",
  rewardsSystem:
    "https://www.dawninternet.com/blog-posts/dawn-validator-extension-rewards-system",
  deployerForm:
    "https://docs.google.com/forms/d/e/1FAIpQLScGrt5O4j7hax8Q3oKF0Wv-Q8N3jtuTP-vUhibiGXyDbF17ow/viewform",
  blackBoxStore: "https://shop.dawninternet.com/",
} as const;

// ─── Extension reward mechanics ───────────────────────────────────────────────
// Source: https://www.dawninternet.com/blog-posts/dawn-validator-extension-rewards-system
// August 7, 2024 — these are the ONLY numbers shown in this app for rewards
export const EXTENSION_REWARDS = {
  /** Total points available per 24-hour period for staying connected */
  pointsPer24Hours: 1440,
  /** Points per hour derived from the 24-hour total */
  pointsPerHour: 60, // 1440 / 24
  /** Referral Tier A: direct referral — percentage of their lifetime points, ongoing */
  referralTierAPercent: 0.20,
  /** Referral Tier B: referral's referral — percentage of their lifetime points, ongoing */
  referralTierBPercent: 0.10,
  /** Referral Tier C: third level — percentage of their lifetime points, ongoing */
  referralTierCPercent: 0.05,
  /** Points awarded per social platform followed through the extension */
  pointsPerSocialPlatform: 5000,
  /** Social platforms available in the extension */
  socialPlatforms: ["X (Twitter)", "Discord", "Telegram"] as const,
} as const;

// ─── Confirmed live DAWN markets ──────────────────────────────────────────────
// UPDATE THIS ARRAY when DAWN announces new confirmed markets.
// Source: DAWN's publicly stated deployment info as of this build.
// Do NOT add speculative or unconfirmed markets here.
export const CONFIRMED_MARKETS: {
  country: string;
  region?: string;
  detail: string;
  confirmed: boolean;
}[] = [
  {
    country: "United States",
    detail: "Stated 4M+ households coverage",
    confirmed: true,
  },
  {
    country: "Ghana",
    region: "Accra",
    detail: "One international pilot deployment in Accra",
    confirmed: true,
  },
  // Add future confirmed markets here — one object per entry
];

// ─── Hardware product facts (qualitative only — no invented numbers) ───────────
// Source: DAWN main site, Black Box store, Deployer form, Whitepaper
export const HARDWARE_FACTS = {
  blackBox: {
    name: "Black Box",
    tagline: "Home WiFi 6E router + multi-network DePIN miner",
    description:
      "The DAWN Black Box is a home WiFi 6E router that simultaneously participates in DAWN's bandwidth validation network AND mines for partner DePIN networks: Helium Mobile, Inference.net, and Pipe Network.",
    partnerNetworks: ["Helium Mobile", "Inference.net", "Pipe Network"],
    mechanisms: [
      "Bandwidth seeding (proof-of-bandwidth validation)",
      "Multi-network DePIN participation",
      "Geographic focus bonus (based on Medallion system zones)",
      "Activation bonus at setup",
    ],
    bestFor: [
      "Home or small office with stable internet",
      "Wanting plug-and-play setup",
      "Urban or suburban residential area",
      "No elevated/rooftop access needed",
    ],
    storeUrl: DAWN_LINKS.blackBoxStore,
  },
  antenna: {
    name: "Antenna / Deployer Network",
    tagline: "Elevated line-of-sight hardware for dense urban coverage",
    description:
      "DAWN's Antenna hardware is targeted at elevated locations with clear line of sight, focused on dense urban areas. The Deployer Interest Form is designed for operators with existing or multiple institutional sites.",
    requirements: [
      "Elevated location (rooftop, tower, commercial building)",
      "Clear line of sight to surrounding area",
      "Dense urban or high-traffic location preferred",
      "Applicants with existing/multiple sites are the primary target",
    ],
    mechanisms: [
      "Wireless network coverage provision",
      "Geographic coverage bonus (Medallion system)",
      "Deployer network participation",
      "Bandwidth seeding at scale",
    ],
    deployerFormNote:
      "This form asks for 'type of deployer' (Internet service provider / Real estate owner / DePIN deployer / Other) and 'existing location(s)' — designed for applicants with existing or multiple sites. Individual applicants can still apply under 'Other.'",
    deployerFormUrl: DAWN_LINKS.deployerForm,
  },
} as const;

// ─── Medallion System facts (qualitative, from Whitepaper) ───────────────────
// Source: DAWN Whitepaper July 25, 2024
export const MEDALLION_SYSTEM = {
  description:
    "DAWN's Whitepaper describes a 'Medallion' system: geographic-zone bonus tokens on a bonding curve tied to H3 hexagon mapping. Medallions provide zone-based coverage incentives.",
  source: DAWN_LINKS.whitepaper,
  note: "No formula or numeric output is computed from Medallion data — qualitative factor only.",
} as const;

// ─── Disclaimer text (used throughout the app) ────────────────────────────────
export const DISCLAIMERS = {
  general:
    "DawnBeacon is an independent, unofficial community tool. Not affiliated with or endorsed by DAWN Internet.",
  dataAccuracy:
    "All reward mechanics shown trace to DAWN's published blog posts and whitepaper. No numbers are invented or estimated beyond what DAWN has published.",
  hardwareRewards:
    "Hardware reward amounts are not published by DAWN as a specific formula. This app shows qualitative factors only — no dollar or point estimate is provided for hardware.",
  mapData:
    "Map data comes from OpenStreetMap via live Overpass API queries. If data is thin or unavailable for an area, this app says so rather than showing a confident-looking placeholder result.",
  marketPresence:
    "DAWN's confirmed live markets are based on publicly stated information. This list may be incomplete and will be updated as DAWN announces new deployments.",
} as const;
