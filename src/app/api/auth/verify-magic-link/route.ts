import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const callbackURL = searchParams.get("callbackURL") || "/dashboard";

    if (!token || !email) {
      return NextResponse.redirect(
        new URL(`/?error=invalid_token`, request.url)
      );
    }

    // Verify token
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email,
        token: token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.redirect(
        new URL(`/?error=invalid_or_expired_token`, request.url)
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      const userId = randomBytes(16).toString("hex");
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          emailVerified: true,
          name: email.split("@")[0],
        },
      });
    } else if (!user.emailVerified) {
      // Update email verified status
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    // Create session using Better Auth
    const sessionToken = randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.session.create({
      data: {
        id: randomBytes(16).toString("hex"),
        userId: user.id,
        token: sessionToken,
        expiresAt: sessionExpires,
      },
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: sessionExpires,
      path: "/",
    });

    // Delete used verification token
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    // Redirect to callback URL
    return NextResponse.redirect(new URL(callbackURL, request.url));
  } catch (error: any) {
    console.error("Error verifying magic link:", error);
    return NextResponse.redirect(
      new URL(`/?error=verification_failed`, request.url)
    );
  }
}

