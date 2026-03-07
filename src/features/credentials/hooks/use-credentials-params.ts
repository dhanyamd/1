import {useQueryStates} from 'nuqs'
import { credentialsParams } from './param'

export const useCredentialParams = () => {
    return useQueryStates(credentialsParams)
}