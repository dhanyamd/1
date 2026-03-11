'use server'
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { DiscordChannel } from "@/inngest/channels/discord";

export type DiscordToken = Realtime.Token<typeof DiscordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: DiscordChannel(),
        topics: ["status"]
    });
    return token
}
