import { NodeStatus } from "@/components/node-status-indicator";
import { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks"
interface UseNodeStatusOptions {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
    nodeId,
    channel,
    topic,
    refreshToken
}: UseNodeStatusOptions) {
    const [status, setStatus] = useState<NodeStatus>("initial");
    const { data } = useInngestSubscription({
        refreshToken,
        enabled: true
    });
    useEffect(() => {
        if (data.length > 0) {
            console.log("REALTIME DATA RECEIVED", {
                nodeId,
                channel,
                topic,
                count: data.length,
            });
        }
        if (!data.length) {
            return;
        }
        const filteredMessages = data.filter(
            (msg) =>
                msg.kind === "data" &&
                msg.channel === channel &&
                msg.topic === topic &&
                msg.data.nodeId === nodeId
        );

        if (filteredMessages.length === 0) return;

        const latestMessage = filteredMessages.sort((a, b) => {
            if (a.kind === "data" && b.kind === "data") {
                return (
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            }
            return 0;
        })[0];

        if (latestMessage && latestMessage.kind === "data") {
            setStatus(latestMessage.data.status as NodeStatus);
        }
    }, [data, nodeId, channel, topic]);
    return status;
}