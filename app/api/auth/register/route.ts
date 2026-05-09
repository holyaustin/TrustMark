// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import VerificationLog from '@/lib/models/VerificationLog';
import { verifyNumber, verifyNumberWithOAuthCode, getKycData, checkSimSwap, checkTenure } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { 
    phoneNumber, 
    businessName, 
    businessAddress, 
    businessCity, 
    businessCountry, 
    oauthCode, 
    oauthState 
  } = await req.json();
  
  console.log('Registration request:', { phoneNumber, businessName, oauthCode, oauthState });
  
  if (!phoneNumber || !businessName || !businessAddress || !businessCity || !businessCountry) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }
  
  // Ensure phone number has + prefix
  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+' + formattedNumber.replace(/[^0-9]/g, '');
  }
  
  // Check if user exists
  const existing = await User.findOne({ phoneNumber: formattedNumber });
  if (existing) {
    return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
  }
  
  let numberVerified = false;
  
  // Verify number using OAuth code if provided, otherwise use direct API
  if (oauthCode && oauthState) {
    console.log('Verifying number with OAuth code:', oauthCode);
    const verification = await verifyNumberWithOAuthCode(formattedNumber, oauthCode, oauthState);
    
    if (!verification.verified) {
      return NextResponse.json({ 
        error: verification.error || 'Phone number verification failed' 
      }, { status: 400 });
    }
    numberVerified = true;
  } else {
    // Fallback for non-OAuth flow (rare)
    const numberVerification = await verifyNumber(formattedNumber);
    if (!numberVerification.verified) {
      return NextResponse.json({ 
        error: numberVerification.error || 'Phone number verification failed' 
      }, { status: 400 });
    }
    numberVerified = true;
  }
  
  // Get KYC data from operator (for auto-fill)
  const kycData = await getKycData(formattedNumber);
  
  // Check SIM swap status
  const simSwap = await checkSimSwap(formattedNumber);
  
  // Check tenure
  const tenure = await checkTenure(formattedNumber);
  
  // Generate unique badge ID
  const badgeId = crypto.randomBytes(6).toString('hex').toUpperCase();
  
  // Create user - SET verificationDate to NOW upon successful registration
  const user = await User.create({
    phoneNumber: formattedNumber,
    businessName,
    businessAddress,
    businessCity,
    businessCountry,
    numberVerified: numberVerified,
    // Set verificationDate to current date/time when number is verified
    verificationDate: new Date(),
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
    badgeActive: false,
    trustScore: 0,
    trustGrade: 'F'
  });
  
  console.log('User created with verificationDate:', user.verificationDate);
  
  // Create verification log
  await VerificationLog.create({
    userId: user._id,
    type: 'number',
    status: 'success',
    responseData: { verified: true, method: oauthCode ? 'oauth' : 'direct' }
  });
  
  // Create JWT token
  const token = createToken(user._id.toString());
  
  const response = NextResponse.json({
    success: true,
    userId: user._id,
    badgeId,
    verificationDate: user.verificationDate,
    kycData: {
      fullName: kycData.fullName,
      birthdate: kycData.birthdate,
      address: kycData.address
    },
    businessInfo: {
      address: businessAddress,
      city: businessCity,
      country: businessCountry
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