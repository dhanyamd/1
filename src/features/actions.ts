import { Realtime } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualRequestChannel } from "@/inngest/channels/manual-request";

export type HttpRequestToken = Realtime.Token<
    typeof httpRequestChannel,
    ["status"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
    const res = await fetch("/api/realtime-token?channel=http-request");
    const data = await res.json();
    return data.token;
}


export type ManualTriggerToken = Realtime.Token<
    typeof manualRequestChannel,
    ["status"]
>;

export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {
    const res = await fetch("/api/realtime-token?channel=manual-request");
    const data = await res.json();
    return data.token;
}