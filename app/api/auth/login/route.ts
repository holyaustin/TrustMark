import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyNumber } from '@/lib/nokia/client';
import { createToken } from '@/lib/utils/jwt';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const { phoneNumber } = await req.json();
  
  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }
  
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return NextResponse.json({ error: 'No account found with this number' }, { status: 404 });
  }
  
  // Verify the number belongs to the user (silent verification)
  const verification = await verifyNumber(phoneNumber);
  if (!verification.verified) {
    return NextResponse.json({ error: 'Verification failed. Please ensure your number is active.' }, { status: 401 });
  }
  
  const token = createToken(user._id.toString());
  
  const response = NextResponse.json({ success: true, user: { id: user._id, businessName: user.businessName } });
  response.cookies.set('trustmark_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  
  return response;
}