import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyNumber } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { phoneNumber, businessName, businessAddress } = await req.json();
  
  // Validate input
  if (!phoneNumber || !businessName || !businessAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Check if user exists
  const existing = await User.findOne({ phoneNumber });
  if (existing) {
    return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
  }
  
  // Verify number via Nokia API
  const numberVerification = await verifyNumber(phoneNumber);
  if (!numberVerification.verified) {
    return NextResponse.json({ error: 'Phone number verification failed. Please ensure your number is active.' }, { status: 400 });
  }
  
  // Generate unique badge ID
  const badgeId = crypto.randomBytes(6).toString('hex').toUpperCase();
  
  // Create user
  const user = await User.create({
    phoneNumber,
    businessName,
    businessAddress,
    verifiedNumber: true,
    badgeId,
    badgeActive: false // Requires location verification
  });
  
  // Create JWT token
  const token = createToken(user._id.toString());
  
  const response = NextResponse.json({
    success: true,
    userId: user._id,
    badgeId,
    message: 'Number verified. Proceed to location verification.'
  });
  
  response.cookies.set('trustmark_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  return response;
}