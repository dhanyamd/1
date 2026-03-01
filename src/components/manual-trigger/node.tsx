import { fetchManualTriggerRealtimeToken } from "@/features/actions";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";
import { BaseTriggerNode } from "@/features/triggers/components/trigger-execution-node";
import { MANUAL_REQUEST_CHANNEL_NAME } from "@/inngest/channels/manual-request";
import  {  NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const nodesStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken
    })
     
    const handleOpenSettings = () => setDialogOpen(true)
    return (
        <>
        <ManualTriggerDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
        {...props} 
        icon={MousePointerIcon}
        status={nodesStatus}
        name="When clicking 'Execute workflow'"
        onSettings={handleOpenSettings} 
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})