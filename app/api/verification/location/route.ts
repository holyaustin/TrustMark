// app/api/verification/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyDeviceLocation } from '@/lib/nokia/client';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  
  const { latitude, longitude, businessAddress, businessCity, businessCountry } = body;
  
  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Location coordinates required' }, { status: 400 });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Use the provided coordinates as the business location to verify against
  const verification = await verifyDeviceLocation(
    user.phoneNumber,
    latitude,
    longitude,
    5000 // 5km radius for business location
  );
  
  if (verification.verified) {
    user.locationVerified = true;
    user.locationData = {
      verifiedAt: new Date(),
      lastLatitude: latitude,
      lastLongitude: longitude,
      matchRate: verification.matchRate,
      lastLocationTime: verification.lastLocationTime
    };
    
    // Only set verificationDate when BOTH KYC and Location are verified
    if (user.kycMatchVerified && !user.verificationDate) {
      user.verificationDate = new Date();
    }
    
    user.badgeActive = user.kycMatchVerified || false;
    user.updatedAt = new Date();
    await user.save();
    
    return NextResponse.json({
      verified: true,
      message: 'Location verified! Your device is at your registered business location.',
      matchRate: verification.matchRate,
      lastLocationTime: verification.lastLocationTime,
      resultType: verification.resultType
    });
  }
  
  return NextResponse.json({
    verified: false,
    message: 'Location verification failed. Your device is not at your registered business location. Please ensure you are at your business address when verifying.'
  }, { status: 400 });
}