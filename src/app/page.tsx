"use client"

import { WorkflowManager } from "../components/workflow-manager";
import { AuthWidget } from "../components/auth-widget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const queryClient = useQueryClient()
  const trpc = useTRPC();
  const {data} = useQuery(trpc.getWorkflows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    },
  }))
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job queued")
    }
  }))
  
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <AuthWidget />
        <p className="text-white"
        >{JSON.stringify(testAi)}</p>
       
        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
       Test ai 
        </Button>
      </div>
    </div>
  );
}