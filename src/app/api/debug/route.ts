import { NextResponse, NextRequest } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    return NextResponse.json({
      session: session ? {
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        } : null,
        sessionData: session.session
      } : null,
      cookies: request.cookies.getAll().map(c => ({
        name: c.name,
        value: c.value.substring(0, 50) + '...',
        hasValue: !!c.value
      })),
      cookieHeader: request.headers.get('cookie'),
      authHeaders: Object.keys(Object.fromEntries(request.headers.entries())).filter(h =>
        h.toLowerCase().includes('auth') || h.toLowerCase().includes('cookie') || h.toLowerCase().includes('session')
      ),
      method: 'POST'
    });
  } catch (error) {
    return NextResponse.json({
      //@ts-ignore
      error: error.message,
            //@ts-ignore
      stack: error.stack?.substring(0, 500),
      method: 'POST'
    }, { status: 500 });
  }
}
