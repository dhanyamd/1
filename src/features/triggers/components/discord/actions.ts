import { Realtime } from "@inngest/realtime";
import { DiscordChannel } from "@/inngest/channels/discord";

export type DiscordToken = Realtime.Token<typeof DiscordChannel, ["status"]>;

export async function fetchDiscordRealtimeToken(): Promise<DiscordToken> {
    const res = await fetch("/api/realtime-token?channel=discord");
    const data = await res.json();
    return data.token;
}
