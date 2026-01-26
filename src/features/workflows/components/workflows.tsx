'use client'
import { useSuspenseWorkflows } from "../hooks/use-workflows"

export const WorkflowList = () => {
    const workfows = useSuspenseWorkflows();
    return (
        <p>
            {JSON.stringify(workfows.data, null, 2)}
        </p>
    )
}