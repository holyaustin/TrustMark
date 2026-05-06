// lib/ai/trust-agent.ts
import { checkSimSwap, checkTenure, verifyKycMatch } from '@/lib/nokia/client';

export interface TrustMetrics {
  kycMatchValid: boolean;
  simSwapSafe: boolean;
  numberVerified: boolean;
  ageVerified: boolean;
  tenureValid: boolean;
  locationVerified: boolean;
  tenureYears?: number;
  kycNameMatch?: boolean;
  kycAddressMatch?: boolean;
}

export interface TrustScoreResult {
  totalScore: number;
  grade: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C' | 'F';
  breakdown: {
    kycMatch: number;
    simSwap: number;
    numberVerification: number;
    ageVerification: number;
    tenure: number;
    location: number;
  };
  recommendations: string[];
  lastCalculated: Date;
}

const WEIGHTS = {
  KYC_MATCH: 20,
  SIM_SWAP: 20,
  NUMBER_VERIFICATION: 15,
  AGE_VERIFICATION: 15,
  TENURE: 15,
  LOCATION: 15
};

export class TrustScoreAgent {
  
  calculateScore(metrics: TrustMetrics): TrustScoreResult {
    let kycMatchScore = 0;
    let simSwapScore = 0;
    let numberScore = 0;
    let ageScore = 0;
    let tenureScore = 0;
    let locationScore = 0;
    const recommendations: string[] = [];

    // 1. KYC Match (20 points) - MOST IMPORTANT
    if (metrics.kycMatchValid) {
      kycMatchScore = WEIGHTS.KYC_MATCH;
    } else {
      recommendations.push("Complete KYC verification by providing your full name and address that match your SIM registration");
    }

    // 2. SIM Swap Status (20 points)
    if (metrics.simSwapSafe) {
      simSwapScore = WEIGHTS.SIM_SWAP;
    } else {
      recommendations.push("⚠️ Recent SIM swap detected - please contact support to re-verify your identity");
    }

    // 3. Number Verification (15 points)
    if (metrics.numberVerified) {
      numberScore = WEIGHTS.NUMBER_VERIFICATION;
    } else {
      recommendations.push("Verify your phone number to activate basic trust level");
    }

    // 4. Age Verification (15 points)
    if (metrics.ageVerified) {
      ageScore = WEIGHTS.AGE_VERIFICATION;
    } else {
      recommendations.push("Add your date of birth to increase trust score by 15 points");
    }

    // 5. KYC Tenure (15 points)
    if (metrics.tenureValid) {
      // Bonus points for longer tenure
      if (metrics.tenureYears && metrics.tenureYears >= 5) {
        tenureScore = WEIGHTS.TENURE;
      } else if (metrics.tenureYears && metrics.tenureYears >= 2) {
        tenureScore = Math.floor(WEIGHTS.TENURE * 0.8);
      } else {
        tenureScore = Math.floor(WEIGHTS.TENURE * 0.6);
      }
    } else {
      recommendations.push("Build longer relationship with your mobile operator to increase tenure score");
    }

    // 6. Location Verification (15 points)
    if (metrics.locationVerified) {
      locationScore = WEIGHTS.LOCATION;
    } else {
      recommendations.push("Verify your business location to prove you operate in your stated state");
    }

    const totalScore = kycMatchScore + simSwapScore + numberScore + ageScore + tenureScore + locationScore;
    
    // Determine grade
    let grade: TrustScoreResult['grade'];
    if (totalScore >= 90) grade = 'AAA';
    else if (totalScore >= 80) grade = 'AA';
    else if (totalScore >= 70) grade = 'A';
    else if (totalScore >= 60) grade = 'BBB';
    else if (totalScore >= 50) grade = 'BB';
    else if (totalScore >= 40) grade = 'B';
    else if (totalScore >= 30) grade = 'C';
    else grade = 'F';

    return {
      totalScore,
      grade,
      breakdown: {
        kycMatch: kycMatchScore,
        simSwap: simSwapScore,
        numberVerification: numberScore,
        ageVerification: ageScore,
        tenure: tenureScore,
        location: locationScore
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