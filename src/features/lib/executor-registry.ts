import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor, NodeexecutorParana, WorkflowContext } from "./types";
import { manualTriggerExecutor } from "@/components/manual-trigger/executor";
import { httpRequestExecutor } from "../editor/components/http-request/executor";
import { googleFormTriggerExecutor } from "../triggers/components/google-form-trigger/executor";
import { GeminiExecutor } from "../triggers/components/gemini/executor";
import { OpenaiExecutor } from "../triggers/components/openai/executor";
import { AnthropicExecutor } from "../triggers/components/anthropic/executor";
import { DiscordExecutor } from "../triggers/components/discord/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
    [NodeType.GEMINI]: GeminiExecutor,
    [NodeType.ANTHROPIC]: AnthropicExecutor,
    [NodeType.OPENAI]: OpenaiExecutor,
    [NodeType.DISCORD]: DiscordExecutor,
    [NodeType.SLACK]: DiscordExecutor,
    
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}