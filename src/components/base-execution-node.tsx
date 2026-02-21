'use client'
import {Position, useReactFlow, type NodeProps } from "@xyflow/react"
import { BaseNode, BaseNodeContent } from "./base-node"
import { type LucideIcon } from "lucide-react"
import { memo } from "react";
import { WorkflowNode } from "./workflow-node";
import Image from "next/image";
import { BaseHandle } from "./base-handle";
import { NodeStatus, NodeStatusIndicator } from "./node-status-indicator";

 
interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    status?: NodeStatus;
    onSettings?: () => void; 
    onDoubleClick?: () => void;
}
const handleDelete = () => {}
export const BaseExecutionNode = memo(
    ({
         id, name, status = "initial",  description, children, onSettings, onDoubleClick, icon,
    }: BaseExecutionNodeProps) => {
        const { setEdges, setNodes} = useReactFlow()
        const Icon = icon
        const handleDelete = () => {
            setNodes((currentNodes) => {
                const updatedNodes = currentNodes.filter((node) => node.id != id)
                return updatedNodes
            })
            setEdges((currentEdges) => {
                const updatedEdges = currentEdges.filter((edge) => edge.source!=id && edge.target != id)
                return updatedEdges
            })
        }        
        return (
            <WorkflowNode 
            name={name} 
            description={description} 
            showToolbar
            onDelete={handleDelete}
            onSettings={onSettings}
            >
                <NodeStatusIndicator variant="border" status={status}>
                <BaseNode status={status} onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16}/>
                ) : (
                    <Icon className="size-4 text-muted-foreground" />
                )}
                {children}
                <BaseHandle
                id="target-1" 
                type="target" 
                position={Position.Left}
                />
                <BaseHandle 
                id="source-1"
                type="source"
                position={Position.Right}
                />
                </BaseNodeContent>
                </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        )
    },
)
