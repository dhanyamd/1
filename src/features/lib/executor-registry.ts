import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "./types";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER]: () => {},
    //[NodeType.INITIAL] : () => {},
   // [NodeType.HTTP_REQUEST]: () => {}
}

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];
    if (!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}