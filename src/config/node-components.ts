import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/editor/components/http-request/node";
import { NodeType } from "@/generated/prisma/enums";
import { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
   // [NodeType.MANUAL_TRIGGER]: ManualTrigger
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents