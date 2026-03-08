'use client'
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node,useReactFlow,  NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { fetchDiscordRealtimeToken } from "./actions";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";


type DiscordNodeData = {
    webhookUrl? : string;
    content?: string;
    username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        topic: "status",
        channel: DISCORD_CHANNEL_NAME,
        refreshToken: fetchDiscordRealtimeToken
    })
    const nodeData = props.data;
    const handleOpenSettings = () => setDialogOpen(true)
    const description = nodeData?.content
        ? `Send: ${nodeData.content.slice(0,50)}...`
        : "Not configured";
    const handleSubmit = (values: DiscordFormValues) => {
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
        <DiscordDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit} 
        defaultValues={nodeData}
        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        status={NodeStatus}
        icon="/discord.svg"
        name="Discord"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});

DiscordNode.displayName = "DiscordNode"