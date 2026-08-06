/**
 * extensionCalculator.ts
 * All formulas use ONLY the real published numbers from:
 * https://www.dawninternet.com/blog-posts/dawn-validator-extension-rewards-system
 * No invented or estimated numbers. Every output is computed live from inputs.
 */

import { EXTENSION_REWARDS } from "@/data/dawnFacts";

export interface ExtensionInputs {
  hoursConnectedPerDay: number; // 0–24
  referralsTierA: number;       // direct referrals
  referralsTierB: number;       // their referrals' referrals
  referralsTierC: number;       // third-level referrals
  socialsFollowed: number;      // 0, 1, 2, or 3
}

export interface ExtensionResult {
  dailyConnectionPoints: number;
  dailyReferralBonusPoints: number;
  oneTimeSocialPoints: number;
  totalDailyPoints: number;
  thirtyDayEstimate: number;
  ninetyDayEstimate: number;
  breakdown: {
    connectionPoints: number;
    tierABonus: number;
    tierBBonus: number;
    tierCBonus: number;
    socialPoints: number;
  };
}

/**
 * Calculate extension reward points based on real published formula.
 * Referral bonus is computed assuming your referrals each earn the SAME
 * daily connection points as you do (conservative/symmetric assumption).
 * This assumption is disclosed in the UI.
 */
export function calculateExtensionRewards(inputs: ExtensionInputs): ExtensionResult {
  // Connection points: 60 points/hour, max 1440/day
  // Source: 1,440 reward points per 24-hour period
  const connectionPoints = Math.min(
    inputs.hoursConnectedPerDay * EXTENSION_REWARDS.pointsPerHour,
    EXTENSION_REWARDS.pointsPer24Hours
  );

  // Referral bonus assumes each referral earns the same connection points as you
  // This is a symmetric, conservative assumption — disclosed in UI
  const tierABonus = inputs.referralsTierA * connectionPoints * EXTENSION_REWARDS.referralTierAPercent;
  const tierBBonus = inputs.referralsTierB * connectionPoints * EXTENSION_REWARDS.referralTierBPercent;
  const tierCBonus = inputs.referralsTierC * connectionPoints * EXTENSION_REWARDS.referralTierCPercent;

  const dailyReferralBonusPoints = tierABonus + tierBBonus + tierCBonus;

  // Social points are one-time, not daily
  // Source: 5,000 points per social platform followed
  const oneTimeSocialPoints = Math.min(inputs.socialsFollowed, 3) * EXTENSION_REWARDS.pointsPerSocialPlatform;

  const totalDailyPoints = connectionPoints + dailyReferralBonusPoints;

  return {
    dailyConnectionPoints: Math.round(connectionPoints),
    dailyReferralBonusPoints: Math.round(dailyReferralBonusPoints),
    oneTimeSocialPoints: Math.round(oneTimeSocialPoints),
    totalDailyPoints: Math.round(totalDailyPoints),
    thirtyDayEstimate: Math.round(totalDailyPoints * 30 + oneTimeSocialPoints),
    ninetyDayEstimate: Math.round(totalDailyPoints * 90 + oneTimeSocialPoints),
    breakdown: {
      connectionPoints: Math.round(connectionPoints),
      tierABonus: Math.round(tierABonus),
      tierBBonus: Math.round(tierBBonus),
      tierCBonus: Math.round(tierCBonus),
      socialPoints: Math.round(oneTimeSocialPoints),
    },
  };
}
