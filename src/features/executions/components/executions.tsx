'use client'
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { Execution, ExecutionStatus } from "@/generated/prisma";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, WorkflowIcon, XCircleIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecutions } from "../hooks/use-execution";
import { useExecutionParams } from "../hooks/use-execution-params";


export const ExecutionPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionParams();
    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page })}

        />
    )
}

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionEmpty />}
        />
    )
}

export const ExecutionHeader = () => {

    return (

        <EntityHeader
            title="Executions"
            description="Create and manage your executions"

        />

    )
}

export const ExecutionContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
            header={<ExecutionHeader />}
            pagination={<ExecutionPagination />}
        >
            {children}
        </EntityContainer>
    )
}


export const Executionloading = () => {
    return <LoadingView entity="Loading executions..." />
}

export const ExecutionError = () => {
    return <ErrorView message="Error loading executions..." />
}

export const ExecutionEmpty = () => {

    return (
        <EmptyView
            message="You haven't created any executions yet. te started by running your first workflow"
        />

    )
}
const formatStatus = (status: ExecutionStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
}
const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />;
    }
}
export const ExecutionItem = ({
    data,
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        }
    }
}) => {
    const duration = data.completedAt
        ? Math.round(
            (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000
        )
        : null
    const subtitle = (
        <>
            {data.workflow.name} &bull; Started{" "}
            {formatDistanceToNow(data.startedAt, { addSuffix: true })}
            {duration !== null && <> &bull; Took {duration}s </>}
        </>
    )

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatStatus(data.status)}
            subtitle={subtitle}
            image={
                <div className="size-8 flex items-center justify-center">
                    {getStatusIcon(data.status)}
                </div>
            }

        />
    )
}