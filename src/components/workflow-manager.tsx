"use client";

import { Button } from "@/components/ui/button";
import { Workflow } from "@/generated/prisma/client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function WorkflowManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: workflows, isLoading, error } = useQuery(trpc.getWorkflows.queryOptions({}));

  const createWorkflow = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions({}));
    }
  }));

  return (
    <div className="space-y-4">
      <Button
        disabled={createWorkflow.isPending}
        onClick={() => createWorkflow.mutate({ name: `Workflow ${Date.now()}` })}
        className="w-full"
      >
        {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
      </Button>

      {createWorkflow.error && (
        <p className="text-red-400 text-sm">
          Error creating workflow: {createWorkflow.error.message}
        </p>
      )}

      <div className="space-y-2">
        <h3 className="text-white font-semibold">Your Workflows:</h3>
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">Error loading workflows: {error.message}</p>
        ) : workflows && workflows.items.length > 0 ? (
          <ul className="space-y-1">
            {workflows.items.map((workflow) => (
              <li key={workflow.id} className="text-gray-300 bg-gray-800 p-2 rounded">
                {workflow.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No workflows yet</p>
        )}
      </div>
    </div>
  );
}
