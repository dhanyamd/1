import { Realtime } from "@inngest/realtime";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

export type GoogleFormTriggerToken = Realtime.Token<typeof googleFormTriggerChannel, ["status"]>;

export async function fetchGoogleFormTriggerRealtimeToken(): Promise<GoogleFormTriggerToken> {
    const res = await fetch("/api/realtime-token?channel=google-form-trigger");
    const data = await res.json();
    return data.token;
}
