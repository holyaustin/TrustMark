// app/api/auth/number-verification/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyNumberWithCode } from '@/lib/oauth/oauth-helper';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    console.log('Callback received - code:', code, 'state:', state);
    
    if (!code || !state) {
      console.error('Missing code or state in callback');
      return NextResponse.redirect(
        new URL('/?error=missing_auth_params', req.url)
      );
    }
    
    // Get phone number from cookie
    const phoneNumber = req.cookies.get('oauth_phone')?.value;
    console.log('Phone from cookie:', phoneNumber);
    
    if (!phoneNumber) {
      console.error('Phone number not found in cookies');
      return NextResponse.redirect(
        new URL('/?error=missing_phone', req.url)
      );
    }
    
    // Store the OAuth code and state in cookies for the registration API
    const response = NextResponse.redirect(
      new URL(`/?verified=true&phone=${encodeURIComponent(phoneNumber)}&code=${code}&state=${state}`, req.url)
    );
    
    // Store code and state in cookies for the registration API to use
    response.cookies.set('oauth_verification_code', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      path: '/'
    });
    
    response.cookies.set('oauth_verification_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5,
      path: '/'
    });
    
    // Clear OAuth flow cookies
    response.cookies.delete('oauth_state');
    response.cookies.delete('oauth_nonce');
    response.cookies.delete('oauth_phone');
    
    return response;
    
  } catch (error: any) {
    console.error('Callback error:', error.message);
    return NextResponse.redirect(
      new URL(`/?error=verification_error&message=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}