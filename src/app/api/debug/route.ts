import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Test if auth object is properly configured
    const authConfig = {
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      betterAuthUrl: process.env.BETTER_AUTH_URL || 'NOT SET',
      nextPublicBetterAuthUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'NOT SET',
      nodeEnv: process.env.NODE_ENV || 'NOT SET',
      authConfigured: !!auth,
      authHandlers: typeof auth.handler
    };

    return NextResponse.json(authConfig);
  } catch (error) {
    return NextResponse.json({
        //@ts-ignore
      error: error?.message,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'
    });
  }
}
