import { NodeExecutor } from "@/features/lib/types";
import { manualRequestChannel } from "@/inngest/channels/manual-request";

type ManualtriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualtriggerData> = async({
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        manualRequestChannel().status({
            nodeId,
            status: "loading"
        })
    )
    const result = await step.run("manual-trigger", async() => context)
    await publish(
        manualRequestChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result;
}