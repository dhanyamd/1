import { NodeExecutor } from "@/features/lib/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormtriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormtriggerData> = async({
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )
    const result = await step.run("google-form-trigger", async() => context)
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )
    return result;
}