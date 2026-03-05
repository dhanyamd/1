import { useNodeStatus } from "@/features/hooks/use-node-status";
import { BaseTriggerNode } from "@/features/triggers/components/trigger-execution-node";
import  {  NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const NodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGoogleFormTriggerRealtimeToken
    })
     
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
        status={NodeStatus}
        name="Google Form"
        description="When form is submitted"
        onSettings={handleOpenSettings} 
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})