import { betterAuth } from "better-auth";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma"
import prisma from "@/lib/db"
import { polarClient } from "./polar";

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
  plugins: [
    polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
            checkout({
                products: [
                    {
                        productId: "726a0a7c-4e40-4a38-9fe5-9dda6464ae2f",
                        slug: "MIRA" // Custom slug for easy reference in Checkout URL, e.g. /checkout/MIRA
                    }
                ],
                successUrl: process.env.POLAR_SUCCESS_URL,
                authenticatedUsersOnly: true
            }),
            portal()
        ],
    })
],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
});