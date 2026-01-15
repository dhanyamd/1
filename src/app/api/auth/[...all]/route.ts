import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

console.log("Auth route loaded, auth object:", !!auth);
console.log("Google client ID configured:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Google client secret configured:", !!process.env.GOOGLE_CLIENT_SECRET);

export const { GET, POST } = toNextJsHandler(auth);


