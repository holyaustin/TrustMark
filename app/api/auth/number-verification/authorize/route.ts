// app/api/auth/number-verification/authorize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/oauth/oauth-helper';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, redirectUri } = await req.json();
    
    if (!phoneNumber || !redirectUri) {
      return NextResponse.json(
        { error: 'Phone number and redirect URI are required' },
        { status: 400 }
      );
    }
    
    const { url, state, nonce } = await generateAuthUrl(phoneNumber, redirectUri);
    
    // Store state and nonce in HTTP-only cookies for validation
    const response = NextResponse.json({
      authUrl: url,
      state: state
    });
    
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });
    
    response.cookies.set('oauth_nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/'
    });
    
    response.cookies.set('oauth_phone', phoneNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/'
    });
    
    return response;
  } catch (error: any) {
    console.error('Authorization request failed:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize verification' },
      { status: 500 }
    );
  }
}