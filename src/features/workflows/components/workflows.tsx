'use client'
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "../hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParama } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParama();
    const {searchValue, onSearchChange} = useEntitySearch({
        params, setParams
    })
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
        />
    )
}

export const WorkflowsPagination  = () => {
    const workflows  = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParama();
    return (
        <EntityPagination 
        disabled={workflows.isFetching}
        totalPages={workflows.data.totalPages} 
        page={workflows.data.page} 
        onPageChange={(page) => setParams({...params, page})}

        />
    )
}

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
    const { handleError, modal } = useUpgradeModal();
    const router = useRouter()
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error)
            }
        })
    }
    return (
        <>
        {modal}
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
        search={<WorkflowsSearch/>}
        pagination={<WorkflowsPagination/>}
        >
            {children} 
            </EntityContainer>
    )
}