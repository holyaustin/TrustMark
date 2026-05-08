// app/api/trust-score/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET() {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Calculate KYC Data Completeness (6th metric)
  const kycDataComplete = !!(
    user.kycData?.fullName && 
    user.kycData?.address && 
    user.kycData?.fullName.length > 0 &&
    user.kycData?.address.length > 0
  );
  
  // NEW WEIGHTS: SIM Swap: 15, Number: 10, Tenure: 25
  const calculateTenureScore = () => {
    if (!user.tenureValid) return 0;
    if (user.tenureYears >= 5) return 25;
    if (user.tenureYears >= 3) return 20;
    if (user.tenureYears >= 1) return 15;
    return 10;
  };
  
  // Build breakdown with NEW weights (6 metrics)
  const breakdown = {
    kycMatch: user.kycMatchVerified ? 20 : 0,
    simSwap: !user.simSwapDetected ? 15 : 0,
    numberVerification: user.numberVerified ? 10 : 0,
    tenure: calculateTenureScore(),
    location: user.locationVerified ? 15 : 0,
    kycDataCompleteness: kycDataComplete ? 15 : 0
  };
  
  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  
  // NEW GRADE SYSTEM: A+, A, B+, B, C+, C, F
  let grade = 'F';
  if (totalScore >= 95) grade = 'A+';
  else if (totalScore >= 85) grade = 'A';
  else if (totalScore >= 75) grade = 'B+';
  else if (totalScore >= 65) grade = 'B';
  else if (totalScore >= 55) grade = 'C+';
  else if (totalScore >= 45) grade = 'C';
  else grade = 'F';
  
  // Build recommendations with new weights
  const recommendations: string[] = [];
  if (!user.kycMatchVerified) recommendations.push("Complete KYC Match verification (+20 points)");
  if (user.simSwapDetected) recommendations.push("⚠️ Recent SIM swap detected - contact support");
  if (!user.numberVerified) recommendations.push("Complete number verification (+10 points)");
  if (!user.tenureValid) recommendations.push("Build longer relationship with your mobile operator (up to +25 points)");
  else if (user.tenureYears < 5) recommendations.push(`Continue building account tenure (${user.tenureYears}/5+ years for +25 points)`);
  if (!user.locationVerified) recommendations.push("Verify your business location (+15 points)");
  if (!kycDataComplete) recommendations.push("Ensure your operator has complete KYC profile (+15 points)");
  
  return NextResponse.json({
    totalScore,
    grade,
    breakdown,
    recommendations,
    lastCalculated: new Date()
  });
}