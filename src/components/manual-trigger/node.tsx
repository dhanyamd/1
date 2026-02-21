import { ManualTriggerDialog } from "@/features/triggers/components/manual-trigger/dialog";
import { BaseTriggerNode } from "@/features/triggers/components/trigger-execution-node";
import  {  NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const nodesStatus = "loading"
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