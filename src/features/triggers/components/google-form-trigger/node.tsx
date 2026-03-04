import { fetchManualTriggerRealtimeToken } from "@/features/actions";
import { useNodeStatus } from "@/features/hooks/use-node-status";
import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";
import { BaseTriggerNode } from "@/features/triggers/components/trigger-execution-node";
import { MANUAL_REQUEST_CHANNEL_NAME } from "@/inngest/channels/manual-request";
import  {  NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const nodesStatus = "initial"
     
    const handleOpenSettings = () => setDialogOpen(true)
    return (
        <>
        <GoogleFormTriggerDialog
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        />
        <BaseTriggerNode
        {...props} 
        icon="/gform.svg"
        status={nodesStatus}
        name="Google Form"
        description="When form is submitted"
        onSettings={handleOpenSettings} 
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})