'use client'
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "../hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParama } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        <EntityList 
        items={workfows.data.items}
        getKey={(workfow) => workfow.id}
        renderItem={(workflow) => <WorkflowItem data={workflow}/>}
        emptyView={<WorkflowsEmpty/>}
            />
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


export const Workflowsloading = () => {
    return <LoadingView entity="Loading workflows..."/>
}

export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows..."/>
}

export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const {handleError, modal}  = useUpgradeModal();
    const router = useRouter()

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error)
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            }
        })
    }
    return (
        <>
        {modal}
        <EmptyView
        onNew={handleCreate}
        message="No workflows found. Get startedd by creating your first workflow"
        />
        </>
    )
}

export const WorkflowItem = ({
data,
}: {
    data: Workflow
}) => {
    return (
        <EntityItem
        href={ `/workflows/${data.id}`}
        title={data.name} 
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
            &bull; Created{" "}
            {formatDistanceToNow(data.createdAt, { addSuffix: true })}
            </>
        }
        image={
            <div className="size8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={()=> {}} 
        isRemoving={false}
        />
    )
}