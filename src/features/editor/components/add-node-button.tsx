import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton = memo(() => {
    const [selectOpen, setSelectOpen] = useState(false)
    return (
     <NodeSelector open={selectOpen} onOpenChange={setSelectOpen}>
        <Button
        onClick={() => {}}
        size="icon" 
        variant="outline" 
        className="bg-background"
                >
        <PlusIcon />
        </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton";