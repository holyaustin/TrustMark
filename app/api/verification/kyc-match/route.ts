// app/api/verification/kyc-match/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { TrustScoreAgent } from '@/lib/ai/trust-agent';
import { generateQRCode } from '@/lib/utils/qrcode';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { fullName, dateOfBirth } = await req.json();
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Compare with operator KYC data
  const kycFullName = user.kycData?.fullName || '';
  const kycBirthdate = user.kycData?.birthdate ? new Date(user.kycData.birthdate) : null;
  const userBirthdate = dateOfBirth ? new Date(dateOfBirth) : null;
  
  const nameMatch = kycFullName.toLowerCase().includes(fullName.toLowerCase()) || 
                    fullName.toLowerCase().includes(kycFullName.toLowerCase());
  const birthdateMatch = kycBirthdate && userBirthdate && 
                         kycBirthdate.toDateString() === userBirthdate.toDateString();
  
  const isMatch = nameMatch; // Birthdate optional for now
  
  if (isMatch) {
    user.userFullName = fullName;
    user.userDateOfBirth = userBirthdate || undefined;
    user.kycMatchVerified = true;
    
    // FIX: Only set verificationDate when BOTH KYC and Location are verified
    // If location is already verified and KYC is now being verified, set the date
    if (user.locationVerified && !user.verificationDate) {
      user.verificationDate = new Date();
    }
    
    user.badgeActive = user.locationVerified || false;
    user.updatedAt = new Date();
    
    // Generate QR code and short link if badge becoming active
    if (user.badgeActive && !user.qrCodeUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const shortLink = `${baseUrl}/verify/${user.badgeId}`;
      const qrCodeUrl = await generateQRCode(shortLink);
      user.qrCodeUrl = qrCodeUrl;
      user.shortLink = shortLink;
    }
    
    await user.save();
    
    // Calculate KYC Data Completeness for trust score
    const kycDataComplete = !!(
      user.kycData?.fullName && 
      user.kycData?.address && 
      user.kycData?.fullName.length > 0 &&
      user.kycData?.address.length > 0
    );
    
    // Calculate trust score with new weights
    const trustAgent = new TrustScoreAgent();
    const trustResult = trustAgent.calculateScore({
      kycMatchValid: true,
      simSwapSafe: !user.simSwapDetected,
      numberVerified: user.numberVerified,
      tenureValid: user.tenureValid,
      locationVerified: user.locationVerified,
      kycDataComplete: kycDataComplete,
      tenureYears: user.tenureYears
    });
    
    user.trustScore = trustResult.totalScore;
    user.trustGrade = trustResult.grade;
    user.trustBreakdown = trustResult.breakdown;
    await user.save();
    
    return NextResponse.json({
      matched: true,
      trustScore: trustResult.totalScore,
      trustGrade: trustResult.grade,
      badgeActive: user.badgeActive,
      verificationDate: user.verificationDate,
      message: 'KYC verified! Your trust score has been updated.'
    });
  }
  
  return NextResponse.json({
    matched: false,
    message: 'KYC verification failed. The name you provided does not match SIM registration records.'
  }, { status: 400 });
}