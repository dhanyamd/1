import {useQueryStates} from 'nuqs'
import { executionParams } from './param'

export const useExecutionParams = () => {
    return useQueryStates(executionParams)
}