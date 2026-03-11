'use client'
import { BaseExecutionNode } from "@/components/base-execution-node";
import { Node, useReactFlow, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { fetchGeminiRealtimeToken } from "./actions";
import { GeminiDialog, GeminiFormValues } from "./dialog";

type GeminiNodeData = {
    variableName?: string;
    credentialId?: string;
    //model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};

type GeminitNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminitNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken
    })
    const nodeData = props.data;
    const handleOpenSettings = () => setDialogOpen(true)
    const description = nodeData?.userPrompt
        ? `gemini-1.5-flash: ${nodeData.userPrompt.slice(0,50)}...`
        : "Not configured";
    const handleSubmit = (values: GeminiFormValues) => {
            setNodes((nodes) => nodes.map((node) => {
              if (node.id === props.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    ...values
                  }
                }
              }
              return node;
            }))
          };
    return (
        <>
        <GeminiDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit} 
        defaultValues={nodeData}
        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        status={NodeStatus}
        icon="/gemini.svg"
        name="Gemini"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});

GeminiNode.displayName = "GeminiNode"