// app/api/verification/sim-swap/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import { checkSimSwap, getSimSwapDate } from '@/lib/nokia/client';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const [swapStatus, swapDate] = await Promise.all([
    checkSimSwap(user.phoneNumber),
    getSimSwapDate(user.phoneNumber)
  ]);
  
  const wasDetected = user.simSwapDetected;
  const isNowDetected = swapStatus.swappedRecently;
  
  if (isNowDetected && !wasDetected) {
    user.simSwapDetected = true;
    user.badgeActive = false;
    await user.save();
    
    await Badge.findOneAndUpdate(
      { userId: user._id },
      { 
        isActive: false, 
        suspendedAt: new Date(), 
        suspensionReason: `SIM swap detected on ${swapDate.lastSwapDate || 'unknown date'}`
      }
    );
    
    return NextResponse.json({
      swappedRecently: true,
      badgeSuspended: true,
      message: 'SIM swap detected. Your badge has been suspended.'
    });
  }
  
  return NextResponse.json({
    swappedRecently: isNowDetected,
    lastSwapDate: swapDate.lastSwapDate,
    badgeSuspended: false
  });
}