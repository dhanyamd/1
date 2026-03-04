import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
open, onOpenChange
}: Props) =>{
    const params = useParams();
    const workflowId = params.workflowId as string
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webhookUrl = 
    `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`
    const copyToClipboard = async () => {
        try{
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard")
        }catch {
            toast.error("Failed to copy url")
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                    Use this webhook URL in your Google Form's Apps Script to 
                    trigger
                    this workflow when a form is submitted 
                    </DialogDescription>
                </DialogHeader>
               <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="webhook-url">
                    Webhook URL
                    </Label>
                    <div className="flex gap-2">
                    <Input
                    id="webhook-url" 
                    value={webhookUrl} 
                    readOnly 
                    className="font-mono text-sm"
                    />
                    <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    >
                        <CopyIcon className="size-4"/>
                    </Button>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                    <h4 className="font-medium text-sm">
                        Google Apps Script:
                    </h4>
                    <Button
                    type="button"
                    variant="outline" 
                    onClick={() => {}}
                    >
                    <CopyIcon className="size-4 mr-2"/>
                    Copy Google Apps Script
                    </Button>
                    </div>
                    </div>
                </div>

               </div>
            </DialogContent>
        </Dialog>
    )
}