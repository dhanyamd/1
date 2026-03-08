import { Realtime } from "@inngest/realtime";
import { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeexecutorParana<TData = Record<string, unknown>> {
    data: TData;
    nodeId: string;
    context: WorkflowContext;
    step: StepTools;
    userId: string;
    publish: Realtime.PublishFn;
}

export type NodeExecutor<TData = Record<string, unknown>> = (
    params: NodeexecutorParana<TData>,
) => Promise<WorkflowContext>