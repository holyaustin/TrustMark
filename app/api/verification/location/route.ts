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
  radius: number = 5000 // 5km radius for business location verification
): Promise<{ verified: boolean; lastLocationTime?: string; matchRate?: number; resultType?: string }> {
  const NOKIA_API_KEY = process.env.NOKIA_API_KEY!;
  const NOKIA_BASE_URL = process.env.NOKIA_API_BASE_URL || 'https://api.networkascode.nokia.io/v1';
  const USE_SIMULATOR = process.env.USE_SIMULATOR === 'true';
  
  if (USE_SIMULATOR) {
    // Original logic: +99999991000 = TRUE (verified), +99999991001 = FALSE (not verified)
    if (phoneNumber === '+99999991000') {
      return { 
        verified: true, 
        matchRate: 95, 
        lastLocationTime: new Date().toISOString(),
        resultType: 'TRUE'
      };
    } else if (phoneNumber === '+99999991001') {
      return { 
        verified: false, 
        matchRate: 0, 
        lastLocationTime: new Date().toISOString(),
        resultType: 'FALSE'
      };
    } else {
      // Default for other test numbers
      return { 
        verified: true, 
        matchRate: 85, 
        lastLocationTime: new Date().toISOString(),
        resultType: 'TRUE'
      };
    }
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
        },
        maxAge: 300
      })
    });
    
    const data = await response.json();
    const resultType = data.verificationResult;
    
    return {
      verified: resultType === 'TRUE' || resultType === 'PARTIAL',
      lastLocationTime: data.lastLocationTime,
      matchRate: data.matchRate || (resultType === 'TRUE' ? 95 : resultType === 'PARTIAL' ? 60 : 0),
      resultType: resultType
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
  
  // Use the provided coordinates as the business location to verify against
  const verification = await verifyDeviceLocation(
    user.phoneNumber,
    latitude,
    longitude,
    5000 // 5km radius
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