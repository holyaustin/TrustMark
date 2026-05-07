// app/api/verification/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/utils/auth';

// Nokia/CAMARA Location Verification API call
async function verifyDeviceLocation(
  phoneNumber: string,
  latitude: number,
  longitude: number,
  radius: number = 500 // 500 meters for business location verification
): Promise<{ verified: boolean; lastLocationTime?: string; matchRate?: number }> {
  const NOKIA_API_KEY = process.env.NOKIA_API_KEY!;
  const NOKIA_BASE_URL = process.env.NOKIA_API_BASE_URL || 'https://api.networkascode.nokia.io/v1';
  const USE_SIMULATOR = process.env.USE_SIMULATOR === 'true';
  
  // For simulator mode, always return success
  if (USE_SIMULATOR) {
    return { verified: true, matchRate: 95, lastLocationTime: new Date().toISOString() };
  }
  
  try {
    const response = await fetch(`${NOKIA_BASE_URL}/location-verification/v1/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOKIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device: { phoneNumber },
        area: {
          areaType: "CIRCLE",
          center: { latitude, longitude },
          radius: radius
        }
      })
    });
    
    const data = await response.json();
    
    // verificationResult can be: TRUE, FALSE, PARTIAL, UNKNOWN
    // For business verification, we consider PARTIAL as acceptable (within proximity)
    return {
      verified: data.verificationResult === 'TRUE' || data.verificationResult === 'PARTIAL',
      lastLocationTime: data.lastLocationTime,
      matchRate: data.matchRate
    };
  } catch (error) {
    console.error('Location verification API error:', error);
    return { verified: false };
  }
}

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
  
  // Verify device is at business location using Nokia/CAMARA API
  // Default radius: 500 meters (suitable for business location verification)
  const verification = await verifyDeviceLocation(
    user.phoneNumber,
    latitude,
    longitude,
    500 // 500m radius - can be adjusted
  );
  
  if (verification.verified) {
    user.locationVerified = true;
    user.locationData = {
      verifiedAt: new Date(),
      lastLatitude: latitude,
      lastLongitude: longitude,
      matchRate: verification.matchRate
    };
    user.badgeActive = user.kycMatchVerified || false;
    user.updatedAt = new Date();
    await user.save();
    
    return NextResponse.json({
      verified: true,
      message: 'Location verified! Your device is at your registered business location.',
      matchRate: verification.matchRate,
      lastLocationTime: verification.lastLocationTime
    });
  }
  
  return NextResponse.json({
    verified: false,
    message: 'Location verification failed. Your device is not at your registered business location. Please ensure you are at your business address when verifying.'
  }, { status: 400 });
}