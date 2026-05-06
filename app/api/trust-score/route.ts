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
  
  // Build recommendations based on missing items
  const recommendations: string[] = [];
  if (!user.kycMatchVerified) recommendations.push("Complete KYC verification (+20 points)");
  if (user.simSwapDetected) recommendations.push("⚠️ Recent SIM swap detected - contact support");
  if (!user.userDateOfBirth) recommendations.push("Add your date of birth (+15 points)");
  if (!user.tenureValid) recommendations.push("Build longer relationship with your mobile operator");
  if (!user.locationVerified) recommendations.push("Verify your business location (+15 points)");
  
  return NextResponse.json({
    totalScore: user.trustScore || 0,
    grade: user.trustGrade || 'F',
    breakdown: user.trustBreakdown || {
      kycMatch: 0,
      simSwap: 0,
      numberVerification: user.numberVerified ? 15 : 0,
      ageVerification: 0,
      tenure: 0,
      location: 0
    },
    recommendations,
    lastCalculated: user.updatedAt
  });
}