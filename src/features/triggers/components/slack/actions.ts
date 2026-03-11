import { Realtime } from "@inngest/realtime";
import { SlackChannel } from "@/inngest/channels/slack";

export type SlackToken = Realtime.Token<typeof SlackChannel, ["status"]>;

export async function fetchSlackRealtimeToken(): Promise<SlackToken> {
    const res = await fetch("/api/realtime-token?channel=slack");
    const data = await res.json();
    return data.token;
}
