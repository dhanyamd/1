import { NodeExecutor } from "@/features/lib/types";

type ManualtriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualtriggerData> = async({
    nodeId,
    context,
    step
}) => {
    const result =await step.run("manual-trigger", async() => context)
    return result;
}