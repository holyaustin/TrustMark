This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.







1. The location PI Route (app/api/verification/location/route.ts) should be worked with care. here is the existing code below so you can update accordingly while keeping other non api related part of the code thesame way.
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

2. the kycmatch route neeed to be fixed corrected also
// app/api/verification/kyc-match/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { TrustScoreAgent } from '@/lib/ai/trust-agent';
import { generateQRCode } from '@/lib/utils/qrcode';
import { getCurrentUser } from '@/lib/utils/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  const userId = await getCurrentUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { fullName, dateOfBirth } = await req.json();
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Compare with operator KYC data
  const kycFullName = user.kycData?.fullName || '';
  const kycBirthdate = user.kycData?.birthdate ? new Date(user.kycData.birthdate) : null;
  const userBirthdate = dateOfBirth ? new Date(dateOfBirth) : null;
  
  const nameMatch = kycFullName.toLowerCase().includes(fullName.toLowerCase()) || 
                    fullName.toLowerCase().includes(kycFullName.toLowerCase());
  const birthdateMatch = kycBirthdate && userBirthdate && 
                         kycBirthdate.toDateString() === userBirthdate.toDateString();
  
  const isMatch = nameMatch; // Birthdate optional for now
  
  if (isMatch) {
    user.userFullName = fullName;
    user.userDateOfBirth = userBirthdate || undefined;
    user.kycMatchVerified = true;
    
    // FIX: Only set verificationDate when BOTH KYC and Location are verified
    // If location is already verified and KYC is now being verified, set the date
    if (user.locationVerified && !user.verificationDate) {
      user.verificationDate = new Date();
    }
    
    user.badgeActive = user.locationVerified || false;
    user.updatedAt = new Date();
    
    // Generate QR code and short link if badge becoming active
    if (user.badgeActive && !user.qrCodeUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
      const shortLink = `${baseUrl}/verify/${user.badgeId}`;
      const qrCodeUrl = await generateQRCode(shortLink);
      user.qrCodeUrl = qrCodeUrl;
      user.shortLink = shortLink;
    }
    
    await user.save();
    
    // Calculate KYC Data Completeness for trust score
    const kycDataComplete = !!(
      user.kycData?.fullName && 
      user.kycData?.address && 
      user.kycData?.fullName.length > 0 &&
      user.kycData?.address.length > 0
    );
    
    // Calculate trust score with new weights
    const trustAgent = new TrustScoreAgent();
    const trustResult = trustAgent.calculateScore({
      kycMatchValid: true,
      simSwapSafe: !user.simSwapDetected,
      numberVerified: user.numberVerified,
      tenureValid: user.tenureValid,
      locationVerified: user.locationVerified,
      kycDataComplete: kycDataComplete,
      tenureYears: user.tenureYears
    });
    
    user.trustScore = trustResult.totalScore;
    user.trustGrade = trustResult.grade;
    user.trustBreakdown = trustResult.breakdown;
    await user.save();
    
    return NextResponse.json({
      matched: true,
      trustScore: trustResult.totalScore,
      trustGrade: trustResult.grade,
      badgeActive: user.badgeActive,
      verificationDate: user.verificationDate,
      message: 'KYC verified! Your trust score has been updated.'
    });
  }
  
  return NextResponse.json({
    matched: false,
    message: 'KYC verification failed. The name you provided does not match SIM registration records.'
  }, { status: 400 });
}