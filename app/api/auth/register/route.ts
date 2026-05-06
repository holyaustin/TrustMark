// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyNumber, getKycData, checkSimSwap, checkTenure } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { phoneNumber, businessName, businessAddress, businessState } = await req.json();
  
  if (!phoneNumber || !businessName || !businessAddress || !businessState) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Check if user exists
  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
  }
  
  // 1. Verify number via Nokia API (15 points potential)
  const numberVerification = await verifyNumber(phoneNumber);
  if (!numberVerification.verified) {
    return NextResponse.json({ error: 'Phone number verification failed' }, { status: 400 });
  }
  
  // 2. Get KYC data from operator (for auto-fill)
  const kycData = await getKycData(phoneNumber);
  
  // 3. Check SIM swap status (20 points potential)
  const simSwap = await checkSimSwap(phoneNumber);
  
  // 4. Check tenure (15 points potential)
  const tenure = await checkTenure(phoneNumber);
  
  // Generate unique badge ID
  const badgeId = crypto.randomBytes(6).toString('hex').toUpperCase();
  
  // Create user
  const user = await User.create({
    phoneNumber,
    businessName,
    businessAddress,
    businessState,
    numberVerified: true,
    simSwapDetected: simSwap.swappedRecently || false,
    tenureValid: tenure.meetsTenure || false,
    tenureYears: tenure.tenureYears || 1,
    contractType: tenure.contractType,
    kycData: {
      fullName: kycData.fullName,
      givenName: kycData.givenName,
      familyName: kycData.familyName,
      birthdate: kycData.birthdate,
      address: kycData.address,
      nationality: kycData.nationality
    },
    badgeId,
    badgeActive: false // Requires location + KYC verification
  });
  
  // Create JWT token
  const token = createToken(user._id.toString());
  
  const response = NextResponse.json({
    success: true,
    userId: user._id,
    badgeId,
    kycData: {
      fullName: kycData.fullName,
      birthdate: kycData.birthdate,
      address: kycData.address
    },
    message: 'Number verified. Proceed to location and KYC verification.'
  });
  
  response.cookies.set('trustmark_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  
  return response;
}