import { DiscordChannel } from "@/inngest/channels/discord";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualRequestChannel } from "@/inngest/channels/manual-request";
import { SlackChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type SlackToken = Realtime.Token<
    typeof SlackChannel,
    ["status"]
>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: SlackChannel(),
        topics: ["status"]
    });
    return token
}
