import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import VerificationLog from '@/lib/models/VerificationLog';
import { checkSimSwap } from '@/lib/nokia/client';

// This endpoint should be called by Vercel Cron Jobs every 24 hours
// Or can be called manually for testing

export async function GET() {
  // Verify cron secret (optional but recommended)
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await connectToDatabase();
  
  const users = await User.find({ badgeActive: true, verifiedNumber: true });
  let suspendedCount = 0;
  let checkedCount = 0;
  
  for (const user of users) {
    checkedCount++;
    const swapStatus = await checkSimSwap(user.phoneNumber);
    
    await VerificationLog.create({
      userId: user._id,
      type: 'sim_swap',
      status: swapStatus.swappedRecently ? 'failed' : 'success',
      responseData: swapStatus
    });
    
    if (swapStatus.swappedRecently && !user.simSwapDetected) {
      user.simSwapDetected = true;
      user.badgeActive = false;
      user.updatedAt = new Date();
      await user.save();
      
      await Badge.findOneAndUpdate(
        { userId: user._id },
        { 
          isActive: false, 
          suspendedAt: new Date(), 
          suspensionReason: `SIM swap detected on ${swapStatus.lastSwapDate || 'unknown date'}`
        }
      );
      
      suspendedCount++;
      
      // TODO: Send SMS alert to seller (optional)
      // await sendSmsAlert(user.phoneNumber, 'Your TrustMark badge has been suspended due to a SIM swap. Please contact support to re-verify.');
    } else if (!swapStatus.swappedRecently && user.simSwapDetected) {
      // Optionally auto-reactivate after a cooldown period? For now, require manual re-verification
      // We'll leave as is - user must contact support
    }
    
    user.lastSimSwapCheck = new Date();
    await user.save();
  }
  
  return NextResponse.json({
    success: true,
    checked: checkedCount,
    suspended: suspendedCount,
    timestamp: new Date().toISOString()
  });
}