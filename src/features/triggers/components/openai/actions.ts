import { GeminiChannel } from "@/inngest/channels/gemini";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualRequestChannel } from "@/inngest/channels/manual-request";
import { OpenaiChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type OpenaiToken = Realtime.Token<
    typeof OpenaiChannel,
    ["status"]
>;

export async function fetchOpenaiRealtimeToken(): Promise<OpenaiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: OpenaiChannel(),
        topics: ["status"]
    });
    return token
}
