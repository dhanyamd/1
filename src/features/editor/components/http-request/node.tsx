'use client'
import { BaseExecutionNode } from "@/components/base-execution-node";
import {Node,useReactFlow,  NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()
    const nodeData = props.data;
    const NodeStatus = "loading"
    const handleOpenSettings = () => setDialogOpen(true)
    const description = nodeData?.endpoint
        ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
        : "Not configured";
    const handleSubmit = (values: HttpRequestFormValues) => {
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
        <HttpRequestDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit} 
        defaultValues={nodeData}
        />
        <BaseExecutionNode
        {...props}
        id={props.id}
        status={NodeStatus}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
});

HttpRequestNode.displayName = "HttpRequestNode"