import { Realtime } from "@inngest/realtime";
import { GeminiChannel } from "@/inngest/channels/gemini";

export type GeminiToken = Realtime.Token<typeof GeminiChannel, ["status"]>;

export async function fetchGeminiRealtimeToken(): Promise<GeminiToken> {
    const res = await fetch("/api/realtime-token?channel=gemini");
    const data = await res.json();
    return data.token;
}
