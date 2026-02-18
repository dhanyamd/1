'use client'
import {Position, useReactFlow, type NodeProps } from "@xyflow/react"
import { type LucideIcon } from "lucide-react"
import { memo } from "react";
import Image from "next/image";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { BaseHandle } from "@/components/base-handle";

 
interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
   // status?: NodeStatus;
    onSettings?: () => void; 
    onDoubleClick?: () => void;
}
export const BaseTriggerNode = memo(
    ({
         id, name, description, children, onSettings, onDoubleClick, icon
    }: BaseTriggerNodeProps) => {
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
                <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16}/>
                ) : (
                    <Icon className="size-4 text-muted-foreground" />
                )}
                {children}
                
                <BaseHandle 
                id="source-1"
                type="source"
                position={Position.Right}
                />
                </BaseNodeContent>
                </BaseNode>

            </WorkflowNode>
        )
    },
)

BaseTriggerNode.displayName = "BaseTriggerNode"