import { AnthropicChannel } from "@/inngest/channels/anthropic";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type AntropicToken = Realtime.Token<
    typeof AnthropicChannel,
    ["status"]
>;

export async function fetchAnthropicRealtimeToken(): Promise<AntropicToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: AnthropicChannel(),
        topics: ["status"]
    });
    return token
}
