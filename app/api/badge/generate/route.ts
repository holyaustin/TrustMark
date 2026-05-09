// app/api/badge/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import { generateQRCode } from '@/lib/utils/qrcode';
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
  
  // ALWAYS generate QR code regardless of verification status
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const shortLink = `${baseUrl}/verify/${user.badgeId}`;
  const qrCodeUrl = await generateQRCode(shortLink);
  
  // Update user with QR info
  user.qrCodeUrl = qrCodeUrl;
  user.shortLink = shortLink;
  await user.save();
  
  // Update or create badge
  await Badge.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      badgeId: user.badgeId,
      qrCodeUrl,
      shortLink,
      isActive: true,
      trustScore: user.trustScore || 0,
      trustGrade: user.trustGrade || 'F'
    },
    { upsert: true }
  );
  
  return NextResponse.json({
    success: true,
    shortLink,
    qrCodeUrl,
    badgeId: user.badgeId,
    businessName: user.businessName,
    trustScore: user.trustScore || 0,
    trustGrade: user.trustGrade || 'F',
    verificationDate: user.verificationDate
  });
}