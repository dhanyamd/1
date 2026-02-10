import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.getWorkflows>;

export const prefetchWorkflows = (params: Input) => {
    return prefetch(trpc.getWorkflows.queryOptions(params))
}


export const prefetchWorkflow = (id : string) => {
    return prefetch(trpc.getWorkflow.queryOptions({id}))
}
