import { InitialNode } from "@/components/initial-node";
import { ManualTriggerNode } from "@/components/manual-trigger/node";
import { HttpRequestNode } from "@/features/editor/components/http-request/node";
import { AnthropicNode } from "@/features/triggers/components/anthropic/node";
import { DiscordNode } from "@/features/triggers/components/discord/node";
import { GeminiNode } from "@/features/triggers/components/gemini/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { OpenaiNode } from "@/features/triggers/components/openai/node";
import { SlackNode } from "@/features/triggers/components/slack/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.OPENAI]: OpenaiNode,
    [NodeType.ANTHROPIC]: AnthropicNode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.SLACK]: SlackNode
} as const satisfies NodeTypes;


export type RegisteredNodeType = keyof typeof nodeComponents;