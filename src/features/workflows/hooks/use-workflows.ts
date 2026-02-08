import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParama } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParama();
    return useSuspenseQuery(trpc.getWorkflows.queryOptions(params))
}

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();


    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow ${data.name} created`);
                queryClient.invalidateQueries(
                    trpc.getWorkflows.queryOptions({})
                )
            },
            onError: (error) => {
                toast.error(`Failed to create workflow: ${error.message}`)
            }
        }
            
        )
    )
}