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

export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.deleteWorkflow.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Worklow ${data.name} removed`);
                queryClient.invalidateQueries(
                    trpc.getWorkflows.queryOptions({}));
                queryClient.invalidateQueries(trpc.getWorkflow.queryFilter({id: data.id}))
            },
            
        }
        )
    )
}

export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.getWorkflow.queryOptions({id}))
}

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();


    return useMutation(
        trpc.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow ${data.name} updated`);
                queryClient.invalidateQueries(
                    trpc.getWorkflows.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.getWorkflow.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`)
            }
        }
            
        )
    )
}

export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();


    return useMutation(
        trpc.updateWorkflow.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow ${data.name} saved`);
                queryClient.invalidateQueries(
                    trpc.getWorkflows.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.getWorkflow.queryOptions({id: data.id})
                )
            },
            onError: (error) => {
                toast.error(`Failed to update workflow: ${error.message}`)
            }
        }
            
        )
    )
}

