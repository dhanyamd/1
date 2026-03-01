import {channel, topic} from "@inngest/realtime"

export const MANUAL_REQUEST_CHANNEL_NAME = "manual-request-execution"

export const manualRequestChannel = channel(MANUAL_REQUEST_CHANNEL_NAME)
 .addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error";
    }>()
 )