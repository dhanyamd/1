import { Realtime } from "@inngest/realtime";
import { AnthropicChannel } from "@/inngest/channels/anthropic";

export type AntropicToken = Realtime.Token<typeof AnthropicChannel, ["status"]>;

export async function fetchAnthropicRealtimeToken(): Promise<AntropicToken> {
    const res = await fetch("/api/realtime-token?channel=anthropic");
    const data = await res.json();
    return data.token;
}
