'use server'
import { getSubscriptionToken, Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualRequestChannel } from "@/inngest/channels/manual-request";

export type HttpRequestToken = Realtime.Token<
    typeof httpRequestChannel,
    ["status"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"]
    });
    return token
}


export type ManualTriggerToken = Realtime.Token<
    typeof manualRequestChannel,
    ["status"]
>;

export async function fetchManualTriggerRealtimeToken(): Promise<ManualTriggerToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: manualRequestChannel(),
        topics: ["status"]
    });
    return token
}