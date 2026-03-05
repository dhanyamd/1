import { InitialNode } from "@/components/initial-node";
import { ManualTriggerNode } from "@/components/manual-trigger/node";
import { HttpRequestNode } from "@/features/editor/components/http-request/node";
import { GeminiNode } from "@/features/triggers/components/gemini/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
    [NodeType.GEMINI]: GeminiNode
} as const satisfies NodeTypes;


export type RegisteredNodeType = keyof typeof nodeComponents;