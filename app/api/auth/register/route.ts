// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import VerificationLog from '@/lib/models/VerificationLog';
import { verifyNumber, getKycData, checkSimSwap, checkTenure } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { phoneNumber, businessName, businessAddress, businessCity, businessCountry } = await req.json();
  
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
  
  // 1. Verify number via Nokia API
  const numberVerification = await verifyNumber(formattedNumber);
  
  if (!numberVerification.verified) {
    return NextResponse.json({ 
      error: numberVerification.error || 'Phone number verification failed. Use +99999991000 for testing.' 
    }, { status: 400 });
  }
  
  // 2. Get KYC data from operator (for auto-fill)
  const kycData = await getKycData(formattedNumber);
  
  // 3. Check SIM swap status
  const simSwap = await checkSimSwap(formattedNumber);
  
  // 4. Check tenure
  const tenure = await checkTenure(formattedNumber);
  
  // Generate unique badge ID
  const badgeId = crypto.randomBytes(6).toString('hex').toUpperCase();
  
  // Create user - ADD verificationDate with current date
  const user = await User.create({
    phoneNumber: formattedNumber,
    businessName,
    businessAddress,
    businessCity,
    businessCountry,
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
    badgeActive: false,
    verificationDate: null  // Set to null initially, will be set when badge becomes active
  });
  
  // Create verification log
  await VerificationLog.create({
    userId: user._id,
    type: 'number',
    status: 'success',
    responseData: numberVerification
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
    businessInfo: {  // ADD business info to response
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