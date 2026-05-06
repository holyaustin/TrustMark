// app/api/verification/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { verifyLocation } from '@/lib/nokia/client';
import { getCurrentUser } from '@/lib/utils/auth';

// Simple geocoding helper (in production, use a proper service)
// For hackathon, we'll use a simplified mapping
function getStateFromCoordinates(lat: number, lng: number): string {
  // Simplified for demo - in production use reverse geocoding
  // Lagos coordinates approximate
  if (lat >= 6.4 && lat <= 6.6 && lng >= 3.2 && lng <= 3.4) return 'Lagos';
  if (lat >= 9.0 && lat <= 9.1 && lng >= 7.4 && lng <= 7.5) return 'Abuja';
  return 'Lagos'; // Default for simulator
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { latitude, longitude, expectedState } = await req.json();
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Get actual state from coordinates (simplified for demo)
  const actualState = getStateFromCoordinates(latitude, longitude);
  
  // Dynamic verification - only check if same state, not exact address
  const isSameState = actualState.toLowerCase() === expectedState.toLowerCase();
  
  if (isSameState) {
    user.locationVerified = true;
    user.badgeActive = user.kycMatchVerified; // Only activate if KYC also done
    user.updatedAt = new Date();
    await user.save();
    
    return NextResponse.json({
      verified: true,
      stateMatch: actualState,
      message: `Location verified! You are confirmed to be in ${actualState} state.`
    });
  }
  
  return NextResponse.json({
    verified: false,
    stateMatch: actualState,
    expectedState,
    message: `Location verification failed. You appear to be in ${actualState}, but your business is registered in ${expectedState}.`
  }, { status: 400 });
}