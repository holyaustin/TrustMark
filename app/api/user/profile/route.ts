import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('trustmark_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
        trustScore: user.trustScore || 70,
        badgeId: user.badgeId,
        qrCodeUrl: user.qrCodeUrl || badge?.qrCodeUrl,
        shortLink: user.shortLink || badge?.shortLink,
        badgeViews: badge?.views || 0
      }
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('trustmark_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
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
    if (businessAddress && businessAddress !== user.businessAddress) {
      user.verifiedLocation = false;
      user.badgeActive = false;
      await user.save();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}