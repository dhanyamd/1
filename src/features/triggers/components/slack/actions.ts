'use server'
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { SlackChannel } from "@/inngest/channels/slack";

export type SlackToken = Realtime.Token<typeof SlackChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: SlackChannel(),
        topics: ["status"]
    });
    return token
}
