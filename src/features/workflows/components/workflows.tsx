'use client'
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"

export const WorkflowList = () => {
    const workfows = useSuspenseWorkflows();
    return (
        <p>
            {JSON.stringify(workfows.data, null, 2)}
        </p>
    )
}

export const WorkflowsHeader = ({disabled}: {disabled?: boolean})=> {
    const createWorkflow = useCreateWorkflow();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                console.error(error)
            }
        })
    }
    return (
        <>
        <EntityHeader
        title="Workflows"
        description="Create and manage your workflow"
        onNew={handleCreate}
        newButtonLabel="New workflow" 
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        />
        </>
    )
}

export const WorkflowsContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
        header={<WorkflowsHeader/>}
        search={<></>}
        pagination={<></>}
        >
            {children} 
            </EntityContainer>
    )
}