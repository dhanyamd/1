import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { email, callbackURL } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete any existing verification tokens for this email
    await prisma.verification.deleteMany({
      where: { identifier: email },
    });

    // Create new verification token
    await prisma.verification.create({
      data: {
        id: randomBytes(16).toString("hex"),
        identifier: email,
        value: token,
        expiresAt,
        token,
      },
    });

    // Create magic link URL
    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const magicLink = `${baseURL}/api/auth/verify-magic-link?token=${token}&email=${encodeURIComponent(email)}${callbackURL ? `&callbackURL=${encodeURIComponent(callbackURL)}` : ""}`;

    // Check if Resend is configured
    if (!resend) {
      console.error("Resend API key is not configured");
      return NextResponse.json(
        { error: "Email service is not configured. Please set RESEND_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@resend.dev",
      to: email,
      subject: "Sign in to N8N",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Sign in to N8N</h2>
          <p>Click the button below to sign in to your account:</p>
          <a href="${magicLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Sign In
          </a>
          <p style="color: #666; font-size: 14px;">This link will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json(
        { error: emailResult.error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Magic link sent!" });
  } catch (error: any) {
    console.error("Error sending magic link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send magic link" },
      { status: 500 }
    );
  }
}

