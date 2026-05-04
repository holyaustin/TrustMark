import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import VerificationLog from '@/lib/models/VerificationLog';
import { verifyLocation } from '@/lib/nokia/client';
import { generateQRCode } from '@/lib/utils/qrcode';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { latitude, longitude } = await req.json();
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Construct address from coordinates (simplified - in production use reverse geocoding)
  const coordinates = `${latitude},${longitude}`;
  
  // Verify location via Nokia API
  const locationVerification = await verifyLocation(user.phoneNumber, user.businessAddress);
  
  await VerificationLog.create({
    userId: user._id,
    type: 'location',
    status: locationVerification.matched ? 'success' : 'failed',
    responseData: locationVerification
  });
  
  if (locationVerification.matched && locationVerification.confidence > 70) {
    user.verifiedLocation = true;
    user.badgeActive = true;
    user.verificationDate = new Date();
    user.updatedAt = new Date();
    await user.save();
    
    // Generate short link and QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const shortLink = `${baseUrl}/verify/${user.badgeId}`;
    const qrCodeUrl = await generateQRCode(shortLink);
    
    // Create or update badge
    await Badge.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        badgeId: user.badgeId,
        qrCodeUrl,
        shortLink,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for MVP
      },
      { upsert: true }
    );
    
    user.qrCodeUrl = qrCodeUrl;
    user.shortLink = shortLink;
    await user.save();
    
    return NextResponse.json({
      verified: true,
      confidence: locationVerification.confidence,
      shortLink,
      qrCodeUrl,
      message: 'Location verified! Your TrustMark badge is now active.'
    });
  }
  
  return NextResponse.json({
    verified: false,
    confidence: locationVerification.confidence,
    message: 'Location verification failed. Please ensure you are at your registered business address.'
  }, { status: 400 });
}