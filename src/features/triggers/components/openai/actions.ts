'use server'
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { OpenaiChannel } from "@/inngest/channels/openai";

export type OpenaiToken = Realtime.Token<typeof OpenaiChannel, ["status"]>;

export async function fetchOpenaiRealtimeToken(): Promise<OpenaiToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: OpenaiChannel(),
        topics: ["status"]
    });
    return token
}
