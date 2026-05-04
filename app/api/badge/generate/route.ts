import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/Badge';
import { generateQRCode } from '@/lib/utils/qrcode';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await User.findById(userId);
  if (!user || !user.badgeActive) {
    return NextResponse.json({ error: 'User not verified or badge inactive' }, { status: 400 });
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const shortLink = `${baseUrl}/verify/${user.badgeId}`;
  const qrCodeUrl = await generateQRCode(shortLink);
  
  return NextResponse.json({
    shortLink,
    qrCodeUrl,
    badgeId: user.badgeId,
    businessName: user.businessName,
    verificationDate: user.verificationDate
  });
}