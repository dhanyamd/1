'use client'
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node,useReactFlow,  NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { SlackDialog, SlackFormValues } from "./dialog";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";


type SlackNodeData = {
    webhookUrl? : string;
    content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        topic: "status",
        channel: SLACK_CHANNEL_NAME,
        refreshToken: fetchSlackRealtimeToken
    })
    const nodeData = props.data;
    const handleOpenSettings = () => setDialogOpen(true)
    const description = nodeData?.content
        ? `Send: ${nodeData.content.slice(0,50)}...`
        : "Not configured";
    const handleSubmit = (values: SlackFormValues) => {
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
        <SlackDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit} 
        defaultValues={nodeData}
        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        status={NodeStatus}
        icon="/slack.svg"
        name="Slack"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});

SlackNode.displayName = "SlackNode"