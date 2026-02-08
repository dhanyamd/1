import {useQueryStates} from 'nuqs'
import {workflowParams} from '../params'

export const useWorkflowsParama = () => {
    return useQueryStates(workflowParams)
}