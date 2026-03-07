'use client'
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node,useReactFlow,  NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { HTTP_REQUEST_CHANNEL_NAME, httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "@/features/actions";
import { HttpRequestDialog, HttpRequestFormValues } from "@/features/editor/components/http-request/dialog";
import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { OpenaiDialog, OpenaiFormValues } from "./dialog";
import { fetchOpenaiRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenainodeData = {
    variableName?: string;
    credentialId? : string;
    //model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenaiNodeType = Node<OpenainodeData>;

export const OpenaiNode = memo((props: NodeProps<OpenaiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenaiRealtimeToken
    })
    const nodeData = props.data;
    const handleOpenSettings = () => setDialogOpen(true)
    const description = nodeData?.userPrompt
        ? `gpt-4o-mini: ${nodeData.userPrompt.slice(0,50)}...`
        : "Not configured";
    const handleSubmit = (values: OpenaiFormValues) => {
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
        <OpenaiDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit} 
        defaultValues={nodeData}
        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        status={NodeStatus}
        icon="/openai.svg"
        name="OpenAI"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});

OpenaiNode.displayName = "OpenaiNode"