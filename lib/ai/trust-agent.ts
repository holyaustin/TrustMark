// lib/ai/trust-agent.ts
import { checkSimSwap, checkTenure, verifyKycMatch } from '@/lib/nokia/client';

export interface TrustMetrics {
  kycMatchValid: boolean;
  simSwapSafe: boolean;
  numberVerified: boolean;
  tenureValid: boolean;
  locationVerified: boolean;
  kycDataComplete: boolean;
  tenureYears?: number;
}

export interface TrustScoreResult {
  totalScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'F';
  breakdown: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    tenure: number;
    location: number;
    kycDataCompleteness: number;
  };
  recommendations: string[];
  lastCalculated: Date;
}

// NEW WEIGHTS: SIM Swap: 15, Number: 10, Tenure: 25
const WEIGHTS = {
  KYC_MATCH: 20,
  SIM_SWAP: 15,        // Changed from 20 to 15
  NUMBER_VERIFICATION: 10,  // Changed from 15 to 10
  TENURE: 25,          // Changed from 15 to 25
  LOCATION: 15,
  KYC_DATA_COMPLETENESS: 15
};

export class TrustScoreAgent {
  
  calculateScore(metrics: TrustMetrics): TrustScoreResult {
    let kycMatchScore = 0;
    let simSwapScore = 0;
    let numberScore = 0;
    let tenureScore = 0;
    let locationScore = 0;
    let kycDataScore = 0;
    const recommendations: string[] = [];

    // 1. KYC Match (20 points)
    if (metrics.kycMatchValid) {
      kycMatchScore = WEIGHTS.KYC_MATCH;
    } else {
      recommendations.push("Complete KYC verification by providing your full name and address that match your SIM registration");
    }

    // 2. SIM Swap Status (15 points - REDUCED)
    if (metrics.simSwapSafe) {
      simSwapScore = WEIGHTS.SIM_SWAP;
    } else {
      recommendations.push("⚠️ Recent SIM swap detected - please contact support to re-verify your identity");
    }

    // 3. Number Verification (10 points - REDUCED)
    if (metrics.numberVerified) {
      numberScore = WEIGHTS.NUMBER_VERIFICATION;
    } else {
      recommendations.push("Verify your phone number to activate basic trust level");
    }

    // 4. Account Tenure (25 points - INCREASED - Most important!)
    if (metrics.tenureValid && metrics.tenureYears) {
      if (metrics.tenureYears >= 5) {
        tenureScore = WEIGHTS.TENURE;
        recommendations.push("✓ Long-term customer (5+ years) - Excellent! +25 points");
      } else if (metrics.tenureYears >= 3) {
        tenureScore = Math.floor(WEIGHTS.TENURE * 0.8);
        recommendations.push("✓ Established customer (3+ years) - Great! +20 points");
      } else if (metrics.tenureYears >= 1) {
        tenureScore = Math.floor(WEIGHTS.TENURE * 0.6);
        recommendations.push("✓ Active customer (1+ years) - Good! +15 points");
      } else {
        tenureScore = Math.floor(WEIGHTS.TENURE * 0.4);
        recommendations.push("✓ New customer - Build tenure for more points");
      }
    } else {
      recommendations.push("Build longer relationship with your mobile operator (up to +25 points)");
    }

    // 5. Location Verification (15 points)
    if (metrics.locationVerified) {
      locationScore = WEIGHTS.LOCATION;
    } else {
      recommendations.push("Verify your business location to prove you operate at your stated address (+15 points)");
    }

    // 6. KYC Data Completeness (15 points)
    if (metrics.kycDataComplete) {
      kycDataScore = WEIGHTS.KYC_DATA_COMPLETENESS;
      recommendations.push("✓ Complete KYC profile on file with operator +15 points");
    } else {
      recommendations.push("Ensure your mobile operator has your complete KYC information (name and address) +15 points");
    }

    const totalScore = kycMatchScore + simSwapScore + numberScore + tenureScore + locationScore + kycDataScore;
    
    // NEW GRADE SYSTEM: A+, A, B+, B, C+, C, F (Rainbow colors)
    let grade: TrustScoreResult['grade'];
    if (totalScore >= 95) grade = 'A+';
    else if (totalScore >= 85) grade = 'A';
    else if (totalScore >= 75) grade = 'B+';
    else if (totalScore >= 65) grade = 'B';
    else if (totalScore >= 55) grade = 'C+';
    else if (totalScore >= 45) grade = 'C';
    else grade = 'F';

    return {
      totalScore,
      grade,
      breakdown: {
        kycMatch: kycMatchScore,
        simSwap: simSwapScore,
        numberVerification: numberScore,
        tenure: tenureScore,
        location: locationScore,
        kycDataCompleteness: kycDataScore
      },
      recommendations,
      lastCalculated: new Date()
    };
  }

  async updateTrustScore(userId: string, phoneNumber: string, metrics: TrustMetrics): Promise<TrustScoreResult> {
    const result = this.calculateScore(metrics);
    return result;
  }
}