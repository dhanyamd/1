"use client"

import { WorkflowManager } from "../components/workflow-manager";
import { AuthWidget } from "../components/auth-widget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const queryClient = useQueryClient()
  const trpc = useTRPC();
  const {data} = useQuery(trpc.getWorkflows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    },
  }))
  
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <AuthWidget />
        <p className="text-white"
        >{JSON.stringify(data)}</p>
        <Button disabled={create.isPending} onClick={() => create.mutate({ name: "New Workflow" })}>HII</Button>
      </div>
    </div>
  );
}