// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import { getCurrentUser } from '@/lib/utils/auth';

export async function GET() {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await User.findById(userId).lean();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const badge = await Badge.findOne({ userId: user._id });
  
  // DEBUG: Log what we're about to return
  console.log('=== USER PROFILE API DEBUG ===');
  console.log('User ID:', user._id);
  console.log('verificationDate from DB:', user.verificationDate);
  console.log('badgeActive:', user.badgeActive);
  console.log('locationVerified:', user.locationVerified);
  console.log('kycMatchVerified:', user.kycMatchVerified);
  console.log('===============================');
  
  // Return ALL fields including verificationDate
  const responseData = {
    user: {
      id: user._id,
      phoneNumber: user.phoneNumber,
      businessName: user.businessName,
      businessAddress: user.businessAddress || '',
      businessCity: user.businessCity || '',
      businessCountry: user.businessCountry || '',
      numberVerified: user.numberVerified,
      locationVerified: user.locationVerified,
      kycMatchVerified: user.kycMatchVerified,
      simSwapDetected: user.simSwapDetected,
      badgeActive: user.badgeActive,
      verificationDate: user.verificationDate || null,
      trustScore: user.trustScore,
      trustGrade: user.trustGrade,
      trustBreakdown: user.trustBreakdown,
      userFullName: user.userFullName,
      userDateOfBirth: user.userDateOfBirth,
      tenureValid: user.tenureValid,
      tenureYears: user.tenureYears,
      badgeId: user.badgeId,
      qrCodeUrl: user.qrCodeUrl || badge?.qrCodeUrl,
      shortLink: user.shortLink || badge?.shortLink,
      locationData: user.locationData || null,
      kycData: user.kycData || null
    }
  };
  
  console.log('Response verificationDate:', responseData.user.verificationDate);
  
  return NextResponse.json(responseData);
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { businessName, businessAddress, businessCity, businessCountry, userFullName, userDateOfBirth } = await req.json();
  
  const updateData: any = {};
  if (businessName !== undefined) updateData.businessName = businessName;
  if (businessAddress !== undefined) updateData.businessAddress = businessAddress;
  if (businessCity !== undefined) updateData.businessCity = businessCity;
  if (businessCountry !== undefined) updateData.businessCountry = businessCountry;
  if (userFullName !== undefined) updateData.userFullName = userFullName;
  if (userDateOfBirth !== undefined) updateData.userDateOfBirth = new Date(userDateOfBirth);
  
  updateData.updatedAt = new Date();
  
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  
  return NextResponse.json({ success: true, user });
}

// Also handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}