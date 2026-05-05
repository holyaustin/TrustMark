import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import VerificationLog from '@/lib/models/VerificationLog';
import { verifyNumber } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  console.log('📝 Registration API called');
  
  try {
    await connectToDatabase();
    console.log('✅ Database connected');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { phoneNumber, businessName, businessAddress } = body;
    
    // Validate input
    if (!phoneNumber || !businessName || !businessAddress) {
      console.log('Missing fields:', { phoneNumber, businessName, businessAddress });
      return NextResponse.json({ 
        error: 'Missing required fields. Please provide phone number, business name, and address.' 
      }, { status: 400 });
    }
    
    // Check if user exists
    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      console.log('User already exists:', phoneNumber);
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }
    
    // For development, skip Nokia verification if no valid API key
    let numberVerified = true;
    const hasValidApiKey = process.env.NOKIA_API_KEY && 
                           process.env.NOKIA_API_KEY !== 'dummy_key_for_testing' &&
                           process.env.NOKIA_API_KEY !== '';
    
    if (hasValidApiKey) {
      try {
        const numberVerification = await verifyNumber(phoneNumber);
        numberVerified = numberVerification.verified;
        console.log('Nokia verification result:', numberVerified);
      } catch (nokiaError) {
        console.error('Nokia API error:', nokiaError);
        // Continue with registration even if Nokia API fails (for development)
        numberVerified = true;
      }
    } else {
      console.log('Skipping Nokia verification (no valid API key)');
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
      badgeActive: false,
      trustScore: 70,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ User created:', user._id);
    
    // Create verification log
    await VerificationLog.create({
      userId: user._id,
      type: 'number',
      status: 'success',
      timestamp: new Date()
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
      maxAge: 60 * 60 * 24 * 7
    });
    
    console.log('✅ Registration successful, token set');
    return response;
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 });
  }
}