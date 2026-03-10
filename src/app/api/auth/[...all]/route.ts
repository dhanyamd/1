import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

console.log("Auth route loaded, auth object:", !!auth);
console.log("Google client ID configured:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Google client secret configured:", !!process.env.GOOGLE_CLIENT_SECRET);

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  return await _GET(request);
}

export async function POST(request: NextRequest) {
  return await _POST(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
  });
}


