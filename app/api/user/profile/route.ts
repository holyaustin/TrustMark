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
  
  return NextResponse.json({
    user: {
      id: user._id,
      phoneNumber: user.phoneNumber,
      businessName: user.businessName,
      businessAddress: user.businessAddress,
      verifiedNumber: user.verifiedNumber,
      verifiedLocation: user.verifiedLocation,
      badgeActive: user.badgeActive,
      simSwapDetected: user.simSwapDetected,
      verificationDate: user.verificationDate,
      trustScore: user.trustScore,
      badgeId: user.badgeId,
      qrCodeUrl: user.qrCodeUrl || badge?.qrCodeUrl,
      shortLink: user.shortLink || badge?.shortLink,
      badgeViews: badge?.views || 0
    }
  });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { businessName, businessAddress } = await req.json();
  
  const user = await User.findByIdAndUpdate(
    userId,
    { businessName, businessAddress, updatedAt: new Date() },
    { new: true }
  );
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // If business address changed, require re-verification
  if (businessAddress !== user.businessAddress) {
    user.verifiedLocation = false;
    user.badgeActive = false;
    await user.save();
  }
  
  return NextResponse.json({ success: true });
}