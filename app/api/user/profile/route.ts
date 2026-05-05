import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Badge from '@/lib/models/Badge';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const token = request.cookies.get('trustmark_token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const badge = await Badge.findOne({ userId: user._id }).lean();
    
    return NextResponse.json({
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        verifiedNumber: user.verifiedNumber || false,
        verifiedLocation: user.verifiedLocation || false,
        badgeActive: user.badgeActive || false,
        simSwapDetected: user.simSwapDetected || false,
        verificationDate: user.verificationDate || null,
        lastSimSwapCheck: user.lastSimSwapCheck || null,
        trustScore: user.trustScore || 70,
        badgeId: user.badgeId || null,
        qrCodeUrl: user.qrCodeUrl || badge?.qrCodeUrl || null,
        shortLink: user.shortLink || badge?.shortLink || null,
        badgeViews: badge?.views || 0
      }
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { businessName, businessAddress } = body;
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (businessName) user.businessName = businessName;
    if (businessAddress) {
      user.businessAddress = businessAddress;
      // If address changes, require re-verification
      user.verifiedLocation = false;
      user.badgeActive = false;
    }
    user.updatedAt = new Date();
    await user.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}