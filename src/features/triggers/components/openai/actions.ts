import { Realtime } from "@inngest/realtime";
import { OpenaiChannel } from "@/inngest/channels/openai";

export type OpenaiToken = Realtime.Token<typeof OpenaiChannel, ["status"]>;

export async function fetchOpenaiRealtimeToken(): Promise<OpenaiToken> {
    const res = await fetch("/api/realtime-token?channel=openai");
    const data = await res.json();
    return data.token;
}
