import { betterAuth } from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma"
import prisma from "@/lib/db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendVerificationEmail: true, // Enable sending verification emails
  },
  email: {
    from: process.env.EMAIL_FROM || "noreply@resend.dev",
    server: {
      host: "smtp.resend.com",
      port: 465,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY || "",
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
});