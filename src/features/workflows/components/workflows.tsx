'use client'
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useSuspenseWorkflows } from "../hooks/use-workflows"

export const WorkflowList = () => {
    const workfows = useSuspenseWorkflows();
    return (
        <p>
            {JSON.stringify(workfows.data, null, 2)}
        </p>
    )
}

export const WorkflowsHeader = ({disabled}: {disabled?: boolean})=> {
    return (
        <>
        <EntityHeader
        title="Workflows"
        description="Create and manage your workflow"
        onNew={()=>{}}
        newButtonLabel="New workflow" 
        disabled={disabled}
        isCreating={false}
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